import { NoteCard } from '@entities/note';
import { StreamCard } from '@entities/stream';
import { Stack, Typography } from '@mui/material';
import { routeConfig } from '@shared/model/route.config';
import { useSnackbar } from '@shared/ui/snackbar';
import { Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useSearch } from '../lib/search';

type SearchResultProps = {
	query?: string;
	noteLinkContext?: 'stream' | 'chat';
	streamId?: string;
};

const horizontalListSx = {
	maxWidth: '100%',
	overflowX: 'auto',
	overflowY: 'hidden',
	pb: 0.5,
	'& > *': {
		flex: '0 0 240px',
	},
};

const STREAM_SEARCH_PREFIX = ':';
const NOTE_SEARCH_ERROR_MESSAGE = 'Не удалось загрузить похожие заметки';
const STREAM_SEARCH_ERROR_MESSAGE = 'Не удалось загрузить похожие потоки';
const noteLinkStyle = {
	color: 'inherit',
	textDecoration: 'none',
	display: 'block',
} as const;

export const SearchResult = ({
	query = '',
	noteLinkContext,
	streamId,
}: SearchResultProps) => {
	const { notesQuery, streamsQuery } = useSearch({ query });
	const { showError } = useSnackbar();
	const isStreamSearch = query.trim().startsWith(STREAM_SEARCH_PREFIX);

	const similarQuery = isStreamSearch ? streamsQuery : notesQuery;
	const notes = notesQuery.data;
	const streams = streamsQuery.data;

	useEffect(() => {
		if (similarQuery.isError) {
			showError(
				isStreamSearch ? STREAM_SEARCH_ERROR_MESSAGE : NOTE_SEARCH_ERROR_MESSAGE,
			);
		}
	}, [
		isStreamSearch,
		showError,
		similarQuery.errorUpdatedAt,
		similarQuery.isError,
	]);

	if (!query || similarQuery.isError) {
		return null;
	}

	if (isStreamSearch) {
		if (!streams?.length) {
			return null;
		}

		return (
			<Stack
				spacing={1}
				sx={{
					minWidth: 0,
					maxWidth: '100%',
				}}
			>
				<Typography variant="L16">Похожие потоки</Typography>

				<Stack
					direction="row"
					spacing={1}
					sx={horizontalListSx}
				>
					{streams.map((stream) => (
						<StreamCard
							key={stream.id}
							id={stream.id}
							text={stream.name}
						/>
					))}
				</Stack>
			</Stack>
		);
	}

	if (!notes?.length) {
		return null;
	}

	return (
		<Stack
			spacing={1}
			sx={{
				minWidth: 0,
				maxWidth: '100%',
			}}
		>
			<Typography variant="L16">Похожие заметки</Typography>

			<Stack
				direction="row"
				spacing={1}
				sx={horizontalListSx}
			>
				{notes.map((note) => {
					const tags = note.streams
						.map((stream) => stream.name)
						.join(', ');
					const noteCard = (
						<NoteCard
							text={note.previewText}
							tags={tags || undefined}
						/>
					);

					if (noteLinkContext === 'chat' && streamId) {
						return (
							<Link
								key={note.id}
								to={routeConfig.chatNote}
								params={{ streamId, noteId: note.id }}
								style={noteLinkStyle}
							>
								{noteCard}
							</Link>
						);
					}

					if (noteLinkContext === 'stream' && streamId) {
						return (
							<Link
								key={note.id}
								to={routeConfig.streamNote}
								params={{ streamId, noteId: note.id }}
								style={noteLinkStyle}
							>
								{noteCard}
							</Link>
						);
					}

					return (
						<NoteCard
							key={note.id}
							id={note.id}
							text={note.previewText}
							tags={tags || undefined}
						/>
					);
				})}
			</Stack>
		</Stack>
	);
};
