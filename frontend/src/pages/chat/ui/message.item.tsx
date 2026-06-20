import { NoteCard } from '@entities/note';
import { StreamCard } from '@entities/stream';
import { Box, Stack, Typography } from '@mui/material';
import {
	ChatMessageResponseDto,
	ChatMessageResultNoteResponseDto,
	ChatMessageStreamResponseDto,
} from '@shared/api';
import { routeConfig } from '@shared/model/route.config';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';

type MessageItemProps = {
	message: ChatMessageResponseDto;
	streamId?: string;
};

const noteLinkStyle = {
	color: 'inherit',
	textDecoration: 'none',
	display: 'block',
} as const;

const MessageItemComponent = ({ message, streamId }: MessageItemProps) => {
	return (
		<Stack
			spacing={1}
			sx={{ paddingBottom: 1 }}
		>
			<UserMessage message={message} />

			<SystemMessage
				message={message}
				streamId={streamId}
			/>
		</Stack>
	);
};

const UserMessage = memo(({ message }: MessageItemProps) => {
	return (
		<Stack
			sx={{
				alignItems: 'end',
			}}
		>
			<Box
				sx={{
					p: 1,
					borderRadius: 1,
					borderBottomRightRadius: 0,
					backgroundColor: 'primary.main',
					color: 'primary.contrastText',
					maxWidth: 400,
					minWidth: 200,
				}}
			>
				<Typography
					variant="R20"
					sx={{
						whiteSpace: 'pre-wrap',
						wordBreak: 'break-word',
					}}
				>
					{message.bodyMarkdown}
				</Typography>
			</Box>
		</Stack>
	);
});

const SystemMessage = memo(({ message, streamId }: MessageItemProps) => {
	if (!message.result) return null;

	const result = message.result;

	return (
		<Stack spacing={1}>
			{result.note && (
				<SystemMessageNote
					note={result.note}
					streamId={streamId}
				/>
			)}
			{!!result.streams.length && (
				<SystemMessageStream streams={result.streams} />
			)}
		</Stack>
	);
});

const SystemMessageNote = memo(
	({
		note,
		streamId,
	}: {
		note: ChatMessageResultNoteResponseDto;
		streamId?: string;
	}) => {
		const noteCard = (
			<NoteCard
				text={note.previewText}
				tags={note.streamNames.join(', ')}
			/>
		);

		return (
			<Stack
				sx={{ maxWidth: 400 }}
				spacing={1}
			>
				<Typography
					variant="L20"
					sx={{ fontStyle: 'italic' }}
				>
					Заметка создана
				</Typography>

				{streamId ? (
					<Link
						to={routeConfig.chatNote}
						params={{ streamId, noteId: note.id }}
						style={noteLinkStyle}
					>
						{noteCard}
					</Link>
				) : (
					<NoteCard
						text={note.previewText}
						tags={note.streamNames.join(', ')}
						id={note.id}
					/>
				)}
			</Stack>
		);
	},
);

const SystemMessageStream = memo(
	({ streams }: { streams: ChatMessageStreamResponseDto[] }) => {
		return (
			<Stack
				spacing={1}
				sx={{ maxWidth: '100%', minWidth: 0 }}
			>
				<Typography
					variant="L20"
					sx={{ fontStyle: 'italic' }}
				>
					{streams.length === 1 ? 'Поток создан' : 'Потоки созданы'}
				</Typography>

				<Stack
					direction="row"
					spacing={1}
					sx={{
						maxWidth: '100%',
						overflowX: 'auto',
						overflowY: 'hidden',
						pb: 1,
						'& > *': {
							flex: '0 0 240px',
						},
					}}
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
	},
);

export const MessageItem = memo(MessageItemComponent);
