export type NoteContentLineSelection = {
	start: number;
	end: number;
};

export type NoteContentLineSplitResult = {
	lines: string[];
	focusedLineIndex: number;
	selectionPosition: number;
};

export const splitNoteContentLines = (bodyMarkdown: string) =>
	bodyMarkdown.split('\n');

export const joinNoteContentLines = (markdownLines: readonly string[]) =>
	markdownLines.join('\n');

export const normalizeInsertedNoteContentText = (text: string) =>
	text.replace(/\r\n?/g, '\n');

export const getNoteContentLineMaxLength = ({
	bodyMarkdownLength,
	lineMarkdownLength,
	maxLength,
}: {
	bodyMarkdownLength: number;
	lineMarkdownLength: number;
	maxLength: number;
}) => maxLength - bodyMarkdownLength + lineMarkdownLength;

export const replaceNoteContentLine = (
	markdownLines: readonly string[],
	lineIndex: number,
	nextLine: string,
) => {
	const nextMarkdownLines = [...markdownLines];
	nextMarkdownLines[lineIndex] = nextLine;

	return nextMarkdownLines;
};

export const replaceNoteContentLineWithLines = (
	markdownLines: readonly string[],
	lineIndex: number,
	nextLines: readonly string[],
) => {
	const nextMarkdownLines = [...markdownLines];
	nextMarkdownLines.splice(lineIndex, 1, ...nextLines);

	return nextMarkdownLines;
};

export const splitNoteContentLine = (
	markdownLines: readonly string[],
	lineIndex: number,
	selection: NoteContentLineSelection,
): NoteContentLineSplitResult => {
	const currentLine = markdownLines[lineIndex] ?? '';
	const nextMarkdownLines = [...markdownLines];
	nextMarkdownLines.splice(
		lineIndex,
		1,
		currentLine.slice(0, selection.start),
		currentLine.slice(selection.end),
	);

	return {
		lines: nextMarkdownLines,
		focusedLineIndex: lineIndex + 1,
		selectionPosition: 0,
	};
};

export const mergeNoteContentLineWithPrevious = (
	markdownLines: readonly string[],
	lineIndex: number,
): NoteContentLineSplitResult => {
	const currentLine = markdownLines[lineIndex] ?? '';
	const previousLine = markdownLines[lineIndex - 1] ?? '';
	const nextMarkdownLines = [...markdownLines];
	nextMarkdownLines.splice(lineIndex - 1, 2, previousLine + currentLine);

	return {
		lines: nextMarkdownLines,
		focusedLineIndex: lineIndex - 1,
		selectionPosition: previousLine.length,
	};
};

export const mergeNoteContentLineWithNext = (
	markdownLines: readonly string[],
	lineIndex: number,
	selectionPosition: number,
): NoteContentLineSplitResult => {
	const currentLine = markdownLines[lineIndex] ?? '';
	const nextLine = markdownLines[lineIndex + 1] ?? '';
	const nextMarkdownLines = [...markdownLines];
	nextMarkdownLines.splice(lineIndex, 2, currentLine + nextLine);

	return {
		lines: nextMarkdownLines,
		focusedLineIndex: lineIndex,
		selectionPosition,
	};
};

export const insertTextIntoNoteContentLine = ({
	markdownLines,
	lineIndex,
	text,
	selection,
}: {
	markdownLines: readonly string[];
	lineIndex: number;
	text: string;
	selection: NoteContentLineSelection;
}): NoteContentLineSplitResult => {
	const currentLine = markdownLines[lineIndex] ?? '';
	const insertedLines = text.split('\n');
	const nextLine =
		currentLine.slice(0, selection.start) +
		text +
		currentLine.slice(selection.end);
	const nextMarkdownLines = replaceNoteContentLineWithLines(
		markdownLines,
		lineIndex,
		nextLine.split('\n'),
	);

	return {
		lines: nextMarkdownLines,
		focusedLineIndex: lineIndex + insertedLines.length - 1,
		selectionPosition: insertedLines.at(-1)?.length ?? 0,
	};
};
