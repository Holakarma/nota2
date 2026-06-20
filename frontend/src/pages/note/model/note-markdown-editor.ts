import {
	type ChangeEvent,
	type ClipboardEvent,
	type FocusEvent,
	type KeyboardEvent,
	type MouseEvent,
	useCallback,
	useMemo,
} from 'react';
import { NOTE_CONTENT_MAX_LENGTH } from './note-content';
import { useNoteContentLineFocus } from './note-content-line-focus';
import {
	type NoteContentLineSelection,
	getNoteContentLineMaxLength,
	insertTextIntoNoteContentLine,
	joinNoteContentLines,
	mergeNoteContentLineWithNext,
	mergeNoteContentLineWithPrevious,
	normalizeInsertedNoteContentText,
	replaceNoteContentLine,
	replaceNoteContentLineWithLines,
	splitNoteContentLine,
	splitNoteContentLines,
} from './note-content-lines';
import {
	type NoteMarkdownLine,
	parseNoteMarkdownLines,
} from './note-markdown-parser';

export type NoteMarkdownEditorLine = {
	index: number;
	markdown: string;
	preview: NoteMarkdownLine;
	isFocused: boolean;
	maxLength: number;
};

type NoteContentEditorInputElement =
	| HTMLInputElement
	| HTMLTextAreaElement;

type UseNoteMarkdownEditorParams = {
	bodyMarkdown: string;
	disabled: boolean;
	onBodyMarkdownChange: (nextBodyMarkdown: string) => void;
	onBodyMarkdownBlur: () => void;
};

const getInputSelection = (
	input: NoteContentEditorInputElement,
): NoteContentLineSelection => ({
	start: input.selectionStart ?? input.value.length,
	end: input.selectionEnd ?? input.value.length,
});

export const useNoteMarkdownEditor = ({
	bodyMarkdown,
	disabled,
	onBodyMarkdownChange,
	onBodyMarkdownBlur,
}: UseNoteMarkdownEditorParams) => {
	const markdownLines = useMemo(
		() => splitNoteContentLines(bodyMarkdown),
		[bodyMarkdown],
	);
	const {
		activeInputRef,
		focusedLineIndex,
		focusLine,
		resetFocusedLine,
	} = useNoteContentLineFocus({
		disabled,
		lineCount: markdownLines.length,
	});
	const previewLines = useMemo(
		() => parseNoteMarkdownLines(markdownLines),
		[markdownLines],
	);
	const lines = useMemo<NoteMarkdownEditorLine[]>(
		() =>
			previewLines.map((previewLine, lineIndex) => {
				const lineMarkdown = markdownLines[lineIndex] ?? '';
				const maxLength = getNoteContentLineMaxLength({
					bodyMarkdownLength: bodyMarkdown.length,
					lineMarkdownLength: lineMarkdown.length,
					maxLength: NOTE_CONTENT_MAX_LENGTH,
				});

				return {
					index: lineIndex,
					markdown: lineMarkdown,
					preview: previewLine,
					isFocused: focusedLineIndex === lineIndex,
					maxLength: Math.max(0, maxLength),
				};
			}),
		[bodyMarkdown.length, focusedLineIndex, markdownLines, previewLines],
	);

	const applyBodyMarkdownChange = useCallback(
		(nextBodyMarkdown: string) => {
			if (nextBodyMarkdown.length > NOTE_CONTENT_MAX_LENGTH) {
				return false;
			}

			onBodyMarkdownChange(nextBodyMarkdown);
			return true;
		},
		[onBodyMarkdownChange],
	);

	const applyMarkdownLines = useCallback(
		(nextMarkdownLines: readonly string[]) =>
			applyBodyMarkdownChange(joinNoteContentLines(nextMarkdownLines)),
		[applyBodyMarkdownChange],
	);

	const applyLinesAndFocus = useCallback(
		({
			lines: nextMarkdownLines,
			focusedLineIndex: nextFocusedLineIndex,
			selectionPosition,
		}: {
			lines: readonly string[];
			focusedLineIndex: number;
			selectionPosition: number;
		}) => {
			if (!applyMarkdownLines(nextMarkdownLines)) {
				return;
			}

			focusLine(nextFocusedLineIndex, selectionPosition);
		},
		[applyMarkdownLines, focusLine],
	);

	const focusLineEnd = useCallback(
		(lineIndex: number) => {
			focusLine(lineIndex, markdownLines[lineIndex]?.length ?? 0);
		},
		[focusLine, markdownLines],
	);

	const handleEditorBlur = useCallback(
		(event: FocusEvent<HTMLDivElement>) => {
			const nextFocusedNode = event.relatedTarget as Node | null;

			if (
				nextFocusedNode &&
				event.currentTarget.contains(nextFocusedNode)
			) {
				return;
			}

			resetFocusedLine();
			onBodyMarkdownBlur();
		},
		[onBodyMarkdownBlur, resetFocusedLine],
	);

	const handleEditorMouseDown = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			if (disabled || event.target !== event.currentTarget) {
				return;
			}

			focusLineEnd(markdownLines.length - 1);
		},
		[disabled, focusLineEnd, markdownLines.length],
	);

	const handleLineChange = useCallback(
		(
			lineIndex: number,
			event: ChangeEvent<NoteContentEditorInputElement>,
		) => {
			const nextLine = normalizeInsertedNoteContentText(
				event.target.value,
			);

			if (!nextLine.includes('\n')) {
				applyMarkdownLines(
					replaceNoteContentLine(markdownLines, lineIndex, nextLine),
				);
				return;
			}

			const insertedLines = nextLine.split('\n');
			const nextMarkdownLines = replaceNoteContentLineWithLines(
				markdownLines,
				lineIndex,
				insertedLines,
			);

			applyLinesAndFocus({
				lines: nextMarkdownLines,
				focusedLineIndex: lineIndex + insertedLines.length - 1,
				selectionPosition: insertedLines.at(-1)?.length ?? 0,
			});
		},
		[applyLinesAndFocus, applyMarkdownLines, markdownLines],
	);

	const handleLinePaste = useCallback(
		(
			lineIndex: number,
			event: ClipboardEvent<NoteContentEditorInputElement>,
		) => {
			const pastedText = normalizeInsertedNoteContentText(
				event.clipboardData.getData('text'),
			);

			if (!pastedText.includes('\n')) {
				return;
			}

			event.preventDefault();

			const selection = getInputSelection(event.currentTarget);
			const selectedLength = selection.end - selection.start;
			const availableLength =
				NOTE_CONTENT_MAX_LENGTH - bodyMarkdown.length + selectedLength;

			if (availableLength <= 0) {
				return;
			}

			applyLinesAndFocus(
				insertTextIntoNoteContentLine({
					markdownLines,
					lineIndex,
					text: pastedText.slice(0, availableLength),
					selection,
				}),
			);
		},
		[applyLinesAndFocus, bodyMarkdown.length, markdownLines],
	);

	const handleLineKeyDown = useCallback(
		(
			lineIndex: number,
			event: KeyboardEvent<NoteContentEditorInputElement>,
		) => {
			if (event.nativeEvent.isComposing) {
				return;
			}

			const selection = getInputSelection(event.currentTarget);
			const currentLine = markdownLines[lineIndex] ?? '';

			if (event.key === 'Enter') {
				event.preventDefault();
				applyLinesAndFocus(
					splitNoteContentLine(markdownLines, lineIndex, selection),
				);
				return;
			}

			if (
				event.key === 'Backspace' &&
				selection.start === 0 &&
				selection.end === 0 &&
				lineIndex > 0
			) {
				event.preventDefault();
				applyLinesAndFocus(
					mergeNoteContentLineWithPrevious(
						markdownLines,
						lineIndex,
					),
				);
				return;
			}

			if (
				event.key === 'Delete' &&
				selection.start === currentLine.length &&
				selection.end === currentLine.length &&
				lineIndex < markdownLines.length - 1
			) {
				event.preventDefault();
				applyLinesAndFocus(
					mergeNoteContentLineWithNext(
						markdownLines,
						lineIndex,
						selection.start,
					),
				);
				return;
			}

			if (event.key === 'ArrowUp' && lineIndex > 0) {
				event.preventDefault();
				focusLine(
					lineIndex - 1,
					Math.min(
						selection.start,
						markdownLines[lineIndex - 1]?.length ?? 0,
					),
				);
				return;
			}

			if (
				event.key === 'ArrowDown' &&
				lineIndex < markdownLines.length - 1
			) {
				event.preventDefault();
				focusLine(
					lineIndex + 1,
					Math.min(
						selection.start,
						markdownLines[lineIndex + 1]?.length ?? 0,
					),
				);
			}
		},
		[applyLinesAndFocus, focusLine, markdownLines],
	);

	const handlePreviewLineKeyDown = useCallback(
		(lineIndex: number, event: KeyboardEvent<HTMLDivElement>) => {
			if (event.key !== 'Enter' && event.key !== ' ') {
				return;
			}

			event.preventDefault();
			focusLineEnd(lineIndex);
		},
		[focusLineEnd],
	);

	return {
		activeInputRef,
		disabled,
		lines,
		handleEditorBlur,
		handleEditorMouseDown,
		handleLineChange,
		handleLinePaste,
		handleLineKeyDown,
		handlePreviewLineFocus: focusLine,
		handlePreviewLineClick: focusLineEnd,
		handlePreviewLineKeyDown,
	};
};
