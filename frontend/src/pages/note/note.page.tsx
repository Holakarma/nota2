import { noteQueries, useRemoveNoteMutation } from '@entities/note';
import {
	Box,
	Button,
	CircularProgress,
	Stack,
	Typography,
} from '@mui/material';
import { useUrlParams } from '@shared/lib/url-params';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { NoteContent } from './ui/note-content';

type NoteReturnContext = 'default' | 'stream' | 'chat';

type NotePageProps = {
	returnContext?: NoteReturnContext;
};

const NotePage = ({ returnContext = 'default' }: NotePageProps) => {
	const navigate = useNavigate();
	const { noteId, streamId } = useUrlParams();

	const isDefaultStream = streamId === DEFAULT_STREAM_ROUTE_PARAM;
	const returnStreamId = isDefaultStream
		? DEFAULT_STREAM_ROUTE_PARAM
		: (streamId ?? '');
	const hasInvalidContext =
		returnContext !== 'default' && !streamId && !isDefaultStream;

	const goToNotes = () => {
		if (returnContext === 'chat') {
			return navigate({
				to: routeConfig.chat,
				params: { streamId: returnStreamId },
			});
		}

		return navigate({
			to: routeConfig.stream,
			params: {
				streamId:
					returnContext === 'stream'
						? returnStreamId
						: DEFAULT_STREAM_ROUTE_PARAM,
			},
		});
	};
	const noteQuery = useQuery({
		...noteQueries.detail({
			id: noteId ?? '',
		}),
		enabled: Boolean(noteId) && !hasInvalidContext,
	});
	const removeNoteMutation = useRemoveNoteMutation({
		onSuccess: async () => {
			await goToNotes();
		},
	});
	const isRemovingNote = removeNoteMutation.isPending;

	const removeNote = () => {
		if (!noteId || isRemovingNote) {
			return;
		}

		removeNoteMutation.mutate({ id: noteId });
	};

	if (noteQuery.isLoading) {
		return (
			<Box
				component="main"
				sx={{
					height: '100%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<CircularProgress color="inherit" />
			</Box>
		);
	}

	if (!noteId || hasInvalidContext || noteQuery.isError || !noteQuery.data) {
		return (
			<Box
				component="main"
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 2,
					px: 2,
				}}
			>
				<Typography variant="R20">Заметка не найдена</Typography>
				<Button
					variant="outlined"
					onClick={goToNotes}
				>
					К заметкам
				</Button>
			</Box>
		);
	}

	return (
		<Box
			component="main"
			sx={{
				height: '100%',
				minHeight: 0,
				display: 'grid',
				gridTemplateRows: 'minmax(0, 1fr) auto',
				rowGap: 1.5,
				pt: 1.375,
				pr: 1.5,
				pb: 1.5,
				pl: 1.5,
			}}
		>
			<NoteContent
				key={noteQuery.data.id}
				noteId={noteQuery.data.id}
				initialBodyMarkdown={noteQuery.data.bodyMarkdown}
				streams={noteQuery.data.streams}
				disabled={isRemovingNote}
			/>

			<Stack
				direction="row"
				spacing={1}
				sx={{
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Button
					variant="outlined"
					disabled={isRemovingNote}
					onClick={goToNotes}
				>
					Назад
				</Button>

				<Button
					type="button"
					variant="outlined"
					disabled={isRemovingNote}
					onClick={removeNote}
				>
					Удалить
				</Button>
			</Stack>
		</Box>
	);
};

export default NotePage;

export const StreamNotePage = () => <NotePage returnContext="stream" />;

export const ChatNotePage = () => <NotePage returnContext="chat" />;
