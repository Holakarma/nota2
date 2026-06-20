import { Box } from '@mui/material';
import type { KeyboardEvent } from 'react';
import type { NoteMarkdownEditorLine } from '../model/note-markdown-editor';
import { NoteMarkdownPreviewLine } from './note-markdown-preview-line';

type NoteMarkdownPreviewRowProps = {
	line: NoteMarkdownEditorLine;
	disabled: boolean;
	onFocus: (lineIndex: number) => void;
	onClick: (lineIndex: number) => void;
	onKeyDown: (
		lineIndex: number,
		event: KeyboardEvent<HTMLDivElement>,
	) => void;
};

export const NoteMarkdownPreviewRow = ({
	line,
	disabled,
	onFocus,
	onClick,
	onKeyDown,
}: NoteMarkdownPreviewRowProps) => (
	<Box
		role={disabled ? undefined : 'button'}
		tabIndex={disabled ? undefined : 0}
		aria-label={`Редактировать строку заметки ${line.index + 1}`}
		onFocus={disabled ? undefined : () => onFocus(line.index)}
		onClick={disabled ? undefined : () => onClick(line.index)}
		onKeyDown={
			disabled ? undefined : (event) => onKeyDown(line.index, event)
		}
		sx={{
			width: '100%',
			boxSizing: 'border-box',
			outline: 0,
			borderRadius: 0.5,
			cursor: disabled ? 'default' : 'text',
			'&:focus-visible': {
				outline: '1px solid',
				outlineColor: 'primary.main',
				outlineOffset: 1,
			},
		}}
	>
		<NoteMarkdownPreviewLine line={line.preview} />
	</Box>
);
