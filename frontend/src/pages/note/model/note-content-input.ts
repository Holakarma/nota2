import { useCallback } from 'react';

type UseNoteContentInputParams = {
	setBodyMarkdown: (bodyMarkdown: string) => void;
	resetSyncProblem: () => void;
	flushBodyMarkdown: () => void;
};

export const useNoteContentInput = ({
	setBodyMarkdown,
	resetSyncProblem,
	flushBodyMarkdown,
}: UseNoteContentInputParams) => {
	const handleBodyMarkdownChange = useCallback(
		(nextBodyMarkdown: string) => {
			resetSyncProblem();
			setBodyMarkdown(nextBodyMarkdown);
		},
		[resetSyncProblem, setBodyMarkdown],
	);

	return {
		handleBodyMarkdownChange,
		handleBodyMarkdownBlur: flushBodyMarkdown,
	};
};
