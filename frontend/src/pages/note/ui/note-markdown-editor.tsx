import { Box } from '@mui/material';
import { useNoteMarkdownEditor } from '../model/note-markdown-editor';
import { NoteMarkdownEditorLine } from './note-markdown-editor-line';

type NoteMarkdownEditorProps = {
	bodyMarkdown: string;
	disabled: boolean;
	onBodyMarkdownChange: (nextBodyMarkdown: string) => void;
	onBodyMarkdownBlur: () => void;
};

export const NoteMarkdownEditor = ({
	bodyMarkdown,
	disabled,
	onBodyMarkdownChange,
	onBodyMarkdownBlur,
}: NoteMarkdownEditorProps) => {
	const editor = useNoteMarkdownEditor({
		bodyMarkdown,
		disabled,
		onBodyMarkdownChange,
		onBodyMarkdownBlur,
	});

	return (
		<Box
			onBlur={editor.handleEditorBlur}
			onMouseDown={editor.handleEditorMouseDown}
			sx={{
				height: '100%',
				minHeight: 0,
				boxSizing: 'border-box',
				overflow: 'auto',
				p: '14px 62px 14px 22px',
				color: 'text.primary',
				cursor: disabled ? 'default' : 'text',
			}}
		>
			{editor.lines.map((line) => (
				<NoteMarkdownEditorLine
					key={line.index}
					line={line}
					disabled={editor.disabled}
					inputRef={editor.activeInputRef}
					onLineChange={editor.handleLineChange}
					onLineKeyDown={editor.handleLineKeyDown}
					onLinePaste={editor.handleLinePaste}
					onPreviewLineFocus={editor.handlePreviewLineFocus}
					onPreviewLineClick={editor.handlePreviewLineClick}
					onPreviewLineKeyDown={editor.handlePreviewLineKeyDown}
				/>
			))}
		</Box>
	);
};
