import { NoteCard, noteQueries } from '@entities/note';
import { streamQueries } from '@entities/stream';
import {
	Alert,
	Box,
	CircularProgress,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import { useThrottledState } from '@shared/lib/throttled-state';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

type NoteGridProps = {
	selectedStreamId?: string;
	searchQuery?: string;
};

const PAGE_LIMIT = 20;
const SIMILAR_NOTES_LIMIT = 50;
const SEARCH_THROTTLE_MS = 700;
const MAX_SEARCH_QUERY_LENGTH = 500;
const noteLinkStyle = {
	color: 'inherit',
	textDecoration: 'none',
	display: 'block',
} as const;
const normalizeSearchQuery = (query = '') =>
	query.trim().slice(0, MAX_SEARCH_QUERY_LENGTH);

export const NoteGrid = ({
	selectedStreamId,
	searchQuery = '',
}: NoteGridProps) => {
	const normalizedSearchQuery = normalizeSearchQuery(searchQuery);
	const throttledSearchQuery = useThrottledState(
		normalizedSearchQuery,
		SEARCH_THROTTLE_MS,
	);
	const isSearchMode = Boolean(normalizedSearchQuery);
	const allNotesQuery = useQuery({
		...noteQueries.list({
			limit: PAGE_LIMIT,
		}),
		enabled: !isSearchMode && !selectedStreamId,
	});
	const streamNotesQuery = useQuery({
		...streamQueries.notes({
			streamId: selectedStreamId ?? '',
			limit: PAGE_LIMIT,
		}),
		enabled: !isSearchMode && Boolean(selectedStreamId),
	});
	const similarNotesQuery = useQuery({
		...noteQueries.similar({
			query: throttledSearchQuery,
			limit: SIMILAR_NOTES_LIMIT,
		}),
		enabled: isSearchMode && Boolean(throttledSearchQuery),
		placeholderData: keepPreviousData,
	});

	const listNotesQuery = selectedStreamId ? streamNotesQuery : allNotesQuery;
	const notesQuery = isSearchMode ? similarNotesQuery : listNotesQuery;
	const notes = isSearchMode
		? (similarNotesQuery.data ?? [])
		: (listNotesQuery.data?.result ?? []);
	const noteRouteStreamId = selectedStreamId ?? DEFAULT_STREAM_ROUTE_PARAM;

	if (notesQuery.isLoading) {
		return (
			<Stack
				sx={{
					width: '100%',
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<CircularProgress />
			</Stack>
		);
	}
	if (notesQuery.isError) {
		return (
			<Stack
				sx={{
					width: '100%',
					flexGrow: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Alert severity="error">Не удалось загрузить заметки</Alert>
			</Stack>
		);
	}

	return (
		<Box
			sx={{
				flexGrow: 1,
				minHeight: 0,
				overflowY: 'auto',
				overflowX: 'hidden',
			}}
		>
			{!!notes.length || (
				<Stack
					sx={{
						height: '100%',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Typography
						variant="L16"
						color="textSecondary"
					>
						Заметок пока нет
					</Typography>
				</Stack>
			)}
			<Grid
				container
				direction="row"
				spacing={1}
				sx={{ alignItems: 'start' }}
			>
				{notes.map((note) => {
					const noteCard = (
						<NoteCard
							text={note.previewText}
							tags={note.streams.map((s) => s.name).join(', ')}
						/>
					);

					return (
						<Grid
							key={note.id}
							size={{ xs: 12, sm: 6, md: 4 }}
						>
							<Link
								to={routeConfig.streamNote}
								params={{
									streamId: noteRouteStreamId,
									noteId: note.id,
								}}
								style={noteLinkStyle}
							>
								{noteCard}
							</Link>
						</Grid>
					);
				})}
			</Grid>
		</Box>
	);
};
