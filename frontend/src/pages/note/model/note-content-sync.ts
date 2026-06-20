import { useUpdateNoteMutation } from '@entities/note';
import { useThrottledState } from '@shared/lib/throttled-state';
import { useCallback, useEffect, useRef } from 'react';
import { normalizeNoteContent } from './note-content-normalization';

export type NoteContentSyncState =
	| 'disabled'
	| 'failed'
	| 'syncing'
	| 'synced';

type UseNoteContentSyncParams = {
	noteId: string;
	bodyMarkdown: string;
	initialBodyMarkdown: string;
	normalizedBodyMarkdown: string;
	disabled: boolean;
	throttleMs: number;
};

export const useNoteContentSync = ({
	noteId,
	bodyMarkdown,
	initialBodyMarkdown,
	normalizedBodyMarkdown,
	disabled,
	throttleMs,
}: UseNoteContentSyncParams) => {
	const currentNoteIdRef = useRef(noteId);
	const hydratedNoteIdRef = useRef(noteId);
	const savedBodyMarkdownRef = useRef(
		normalizeNoteContent(initialBodyMarkdown),
	);
	const failedBodyMarkdownRef = useRef<string | null>(null);
	const throttledBodyMarkdown = useThrottledState(bodyMarkdown, throttleMs);
	const normalizedThrottledBodyMarkdown =
		normalizeNoteContent(throttledBodyMarkdown);

	currentNoteIdRef.current = noteId;

	const {
		mutate: updateNote,
		isError: isUpdateError,
		isPending: isUpdatePending,
	} = useUpdateNoteMutation({
		scope: { id: `note-content:${noteId}` },
		onSuccess: (data, variables) => {
			if (variables.id !== currentNoteIdRef.current) {
				return;
			}

			savedBodyMarkdownRef.current = normalizeNoteContent(data.bodyMarkdown);
			failedBodyMarkdownRef.current = null;
		},
		onError: (_error, variables) => {
			if (variables.id !== currentNoteIdRef.current) {
				return;
			}

			failedBodyMarkdownRef.current = variables.data.bodyMarkdown;
		},
	});

	useEffect(() => {
		const nextSavedBodyMarkdown = normalizeNoteContent(initialBodyMarkdown);

		if (hydratedNoteIdRef.current !== noteId) {
			hydratedNoteIdRef.current = noteId;
			savedBodyMarkdownRef.current = nextSavedBodyMarkdown;
			failedBodyMarkdownRef.current = null;
			return;
		}

		if (nextSavedBodyMarkdown === savedBodyMarkdownRef.current) {
			return;
		}

		savedBodyMarkdownRef.current = nextSavedBodyMarkdown;
		failedBodyMarkdownRef.current = null;
	}, [initialBodyMarkdown, noteId]);

	const syncBodyMarkdown = useCallback(
		(nextBodyMarkdown: string, allowPendingSync = false) => {
			if (
				disabled ||
				(!allowPendingSync && isUpdatePending) ||
				!nextBodyMarkdown ||
				nextBodyMarkdown === savedBodyMarkdownRef.current ||
				nextBodyMarkdown === failedBodyMarkdownRef.current
			) {
				return;
			}

			updateNote({
				id: noteId,
				data: {
					bodyMarkdown: nextBodyMarkdown,
				},
			});
		},
		[disabled, isUpdatePending, noteId, updateNote],
	);

	useEffect(() => {
		if (
			normalizedThrottledBodyMarkdown !== normalizedBodyMarkdown ||
			normalizedThrottledBodyMarkdown === failedBodyMarkdownRef.current
		) {
			return;
		}

		syncBodyMarkdown(normalizedThrottledBodyMarkdown);
	}, [
		normalizedBodyMarkdown,
		normalizedThrottledBodyMarkdown,
		syncBodyMarkdown,
	]);

	const resetSyncProblem = useCallback(() => {
		failedBodyMarkdownRef.current = null;
	}, []);

	const flushBodyMarkdown = useCallback(() => {
		syncBodyMarkdown(normalizedBodyMarkdown, true);
	}, [normalizedBodyMarkdown, syncBodyMarkdown]);

	const hasContent = Boolean(normalizedBodyMarkdown);
	const hasCurrentSyncProblem =
		isUpdateError &&
		failedBodyMarkdownRef.current === normalizedBodyMarkdown;
	const hasUnsavedChanges =
		hasContent && normalizedBodyMarkdown !== savedBodyMarkdownRef.current;
	const syncState: NoteContentSyncState = (() => {
		if (disabled || !hasContent) {
			return 'disabled';
		}

		if (hasCurrentSyncProblem) {
			return 'failed';
		}

		if (hasUnsavedChanges || isUpdatePending) {
			return 'syncing';
		}

		return 'synced';
	})();

	return {
		syncState,
		resetSyncProblem,
		flushBodyMarkdown,
	};
};
