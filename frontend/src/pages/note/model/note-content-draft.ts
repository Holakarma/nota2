import { useEffect, useRef, useState } from 'react';
import { normalizeNoteContent } from './note-content-normalization';

type UseNoteContentDraftParams = {
	noteId: string;
	initialBodyMarkdown: string;
};

export const useNoteContentDraft = ({
	noteId,
	initialBodyMarkdown,
}: UseNoteContentDraftParams) => {
	const [bodyMarkdown, setBodyMarkdown] = useState(initialBodyMarkdown);
	const hydratedNoteIdRef = useRef(noteId);
	const hydratedBodyMarkdownRef = useRef(
		normalizeNoteContent(initialBodyMarkdown),
	);

	useEffect(() => {
		const nextHydratedBodyMarkdown =
			normalizeNoteContent(initialBodyMarkdown);

		if (hydratedNoteIdRef.current !== noteId) {
			hydratedNoteIdRef.current = noteId;
			hydratedBodyMarkdownRef.current = nextHydratedBodyMarkdown;
			setBodyMarkdown(initialBodyMarkdown);
			return;
		}

		if (nextHydratedBodyMarkdown === hydratedBodyMarkdownRef.current) {
			return;
		}

		const previousHydratedBodyMarkdown = hydratedBodyMarkdownRef.current;
		hydratedBodyMarkdownRef.current = nextHydratedBodyMarkdown;
		setBodyMarkdown((currentBodyMarkdown) =>
			normalizeNoteContent(currentBodyMarkdown) ===
			previousHydratedBodyMarkdown
				? initialBodyMarkdown
				: currentBodyMarkdown,
		);
	}, [initialBodyMarkdown, noteId]);

	return {
		bodyMarkdown,
		setBodyMarkdown,
		normalizedBodyMarkdown: normalizeNoteContent(bodyMarkdown),
	};
};
