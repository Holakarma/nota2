import { Box } from '@mui/material';
import type { NoteListStreamResponseDto } from '@shared/api';
import { useNoteContent } from '../model/note-content';
import { NoteContentSyncStatus } from './note-content-sync-status';
import { NoteMarkdownEditor } from './note-markdown-editor';
import { NoteStreamTags } from './note-stream-tags';

type NoteContentProps = {
	noteId: string;
	initialBodyMarkdown: string;
	streams: NoteListStreamResponseDto[];
	disabled?: boolean;
};

export const NoteContent = ({
	noteId,
	initialBodyMarkdown,
	streams,
	disabled = false,
}: NoteContentProps) => {
	const {
		bodyMarkdown,
		syncState,
		handleBodyMarkdownChange,
		handleBodyMarkdownBlur,
	} = useNoteContent({
		noteId,
		initialBodyMarkdown,
		disabled,
	});

	return (
		<Box
			sx={{
				height: '100%',
				minHeight: 0,
				display: 'grid',
				gridTemplateRows: 'auto minmax(0, 1fr)',
				rowGap: 1,
			}}
		>
			<NoteStreamTags
				noteId={noteId}
				streams={streams}
				disabled={disabled}
			/>

			<Box
				sx={{
					position: 'relative',
					minHeight: 0,
				}}
			>
				<NoteMarkdownEditor
					bodyMarkdown={bodyMarkdown}
					disabled={disabled}
					onBodyMarkdownChange={handleBodyMarkdownChange}
					onBodyMarkdownBlur={handleBodyMarkdownBlur}
				/>

				<NoteContentSyncStatus state={syncState} />
			</Box>
		</Box>
	);
};
