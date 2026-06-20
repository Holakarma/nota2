import { useNoteContentDraft } from './note-content-draft';
import { useNoteContentInput } from './note-content-input';
import { useNoteContentSync } from './note-content-sync';

type UseNoteContentParams = {
	noteId: string;
	initialBodyMarkdown: string;
	disabled?: boolean;
};

export const NOTE_CONTENT_MAX_LENGTH = 32768;
export const NOTE_CONTENT_SYNC_THROTTLE_MS = 1000;

export const useNoteContent = ({
	noteId,
	initialBodyMarkdown,
	disabled = false,
}: UseNoteContentParams) => {
	const draft = useNoteContentDraft({
		noteId,
		initialBodyMarkdown,
	});
	const sync = useNoteContentSync({
		noteId,
		bodyMarkdown: draft.bodyMarkdown,
		initialBodyMarkdown,
		normalizedBodyMarkdown: draft.normalizedBodyMarkdown,
		disabled,
		throttleMs: NOTE_CONTENT_SYNC_THROTTLE_MS,
	});
	const input = useNoteContentInput({
		setBodyMarkdown: draft.setBodyMarkdown,
		resetSyncProblem: sync.resetSyncProblem,
		flushBodyMarkdown: sync.flushBodyMarkdown,
	});

	return {
		bodyMarkdown: draft.bodyMarkdown,
		syncState: sync.syncState,
		handleBodyMarkdownChange: input.handleBodyMarkdownChange,
		handleBodyMarkdownBlur: input.handleBodyMarkdownBlur,
	};
};

export type { NoteContentSyncState } from './note-content-sync';
