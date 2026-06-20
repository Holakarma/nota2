import { InputBase } from '@mui/material';
import type {
	ChangeEvent,
	ClipboardEvent,
	KeyboardEvent,
	RefObject,
} from 'react';
import type { NoteContentInputElement } from '../model/note-content-line-focus';
import type { NoteMarkdownEditorLine } from '../model/note-markdown-editor';

type NoteMarkdownLineInputProps = {
	line: NoteMarkdownEditorLine;
	disabled: boolean;
	inputRef: RefObject<NoteContentInputElement | null>;
	onChange: (
		lineIndex: number,
		event: ChangeEvent<NoteContentInputElement>,
	) => void;
	onKeyDown: (
		lineIndex: number,
		event: KeyboardEvent<NoteContentInputElement>,
	) => void;
	onPaste: (
		lineIndex: number,
		event: ClipboardEvent<NoteContentInputElement>,
	) => void;
};

export const NoteMarkdownLineInput = ({
	line,
	disabled,
	inputRef,
	onChange,
	onKeyDown,
	onPaste,
}: NoteMarkdownLineInputProps) => (
	<InputBase
		inputRef={inputRef}
		value={line.markdown}
		onChange={(event) => onChange(line.index, event)}
		disabled={disabled}
		multiline
		fullWidth
		inputProps={{
			maxLength: line.maxLength,
			'aria-label': `Строка заметки ${line.index + 1}`,
			onKeyDown: (event: KeyboardEvent<NoteContentInputElement>) =>
				onKeyDown(line.index, event),
			onPaste: (event: ClipboardEvent<NoteContentInputElement>) =>
				onPaste(line.index, event),
		}}
		sx={{
			width: '100%',
			alignItems: 'flex-start',
			'& .MuiInputBase-input': {
				p: 0,
				typography: 'NoteMarkdownInput',
				color: 'text.primary',
				resize: 'none',
				overflow: 'hidden',
			},
		}}
	/>
);
