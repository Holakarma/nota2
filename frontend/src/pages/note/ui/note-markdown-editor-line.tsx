import type {
	ChangeEvent,
	ClipboardEvent,
	KeyboardEvent,
	RefObject,
} from 'react';
import type { NoteContentInputElement } from '../model/note-content-line-focus';
import type { NoteMarkdownEditorLine as NoteMarkdownEditorLineView } from '../model/note-markdown-editor';
import { NoteMarkdownLineInput } from './note-markdown-line-input';
import { NoteMarkdownPreviewRow } from './note-markdown-preview-row';

type NoteMarkdownEditorLineProps = {
	line: NoteMarkdownEditorLineView;
	disabled: boolean;
	inputRef: RefObject<NoteContentInputElement | null>;
	onLineChange: (
		lineIndex: number,
		event: ChangeEvent<NoteContentInputElement>,
	) => void;
	onLineKeyDown: (
		lineIndex: number,
		event: KeyboardEvent<NoteContentInputElement>,
	) => void;
	onLinePaste: (
		lineIndex: number,
		event: ClipboardEvent<NoteContentInputElement>,
	) => void;
	onPreviewLineFocus: (lineIndex: number) => void;
	onPreviewLineClick: (lineIndex: number) => void;
	onPreviewLineKeyDown: (
		lineIndex: number,
		event: KeyboardEvent<HTMLDivElement>,
	) => void;
};

export const NoteMarkdownEditorLine = ({
	line,
	disabled,
	inputRef,
	onLineChange,
	onLineKeyDown,
	onLinePaste,
	onPreviewLineFocus,
	onPreviewLineClick,
	onPreviewLineKeyDown,
}: NoteMarkdownEditorLineProps) => {
	if (line.isFocused) {
		return (
			<NoteMarkdownLineInput
				line={line}
				disabled={disabled}
				inputRef={inputRef}
				onChange={onLineChange}
				onKeyDown={onLineKeyDown}
				onPaste={onLinePaste}
			/>
		);
	}

	return (
		<NoteMarkdownPreviewRow
			line={line}
			disabled={disabled}
			onFocus={onPreviewLineFocus}
			onClick={onPreviewLineClick}
			onKeyDown={onPreviewLineKeyDown}
		/>
	);
};
