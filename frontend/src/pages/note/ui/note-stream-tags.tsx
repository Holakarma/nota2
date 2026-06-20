import {
	useAttachNoteToStreamMutation,
	useCreateStreamMutation,
	useDetachNoteFromStreamMutation,
	streamQueries,
	normalizeStreamName,
} from '@entities/stream';
import { Box, Chip, InputBase, Stack } from '@mui/material';
import type { NoteListStreamResponseDto, StreamResponseDto } from '@shared/api';
import { useSnackbar } from '@shared/ui/snackbar';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { noteQueryKeys } from '@entities/note';
import { isConflictError } from '@shared/api/errors';

type NoteStreamTagsProps = {
	noteId: string;
	streams: NoteListStreamResponseDto[];
	disabled?: boolean;
};

const MAX_STREAM_NAME_LENGTH = 128;
const STREAM_SEARCH_LIMIT = 100;

const isSameStreamName = (
	stream: Pick<StreamResponseDto, 'name' | 'normalizedName'>,
	name: string,
) => {
	const normalizedName = normalizeStreamName(name);

	return (
		normalizeStreamName(stream.name) === normalizedName ||
		normalizeStreamName(stream.normalizedName) === normalizedName
	);
};

const isStreamResponse = (value: unknown): value is StreamResponseDto =>
	typeof value === 'object' &&
	value !== null &&
	'id' in value &&
	typeof value.id === 'string';

export const NoteStreamTags = ({
	noteId,
	streams,
	disabled = false,
}: NoteStreamTagsProps) => {
	const [streamName, setStreamName] = useState('');
	const queryClient = useQueryClient();
	const { showError } = useSnackbar();

	const invalidateNote = async () => {
		await Promise.all([
			queryClient.invalidateQueries({
				queryKey: noteQueryKeys.detail(noteId),
			}),
			queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }),
			queryClient.invalidateQueries({
				queryKey: noteQueryKeys.similar(),
			}),
		]);
	};

	const createStreamMutation = useCreateStreamMutation();
	const attachNoteToStreamMutation = useAttachNoteToStreamMutation({
		onSuccess: invalidateNote,
	});
	const detachNoteFromStreamMutation = useDetachNoteFromStreamMutation({
		onSuccess: invalidateNote,
	});

	const isPending =
		createStreamMutation.isPending ||
		attachNoteToStreamMutation.isPending ||
		detachNoteFromStreamMutation.isPending;
	const isDisabled = disabled || isPending;
	const normalizedStreamName = normalizeStreamName(streamName);

	const findExistingStream = async (name: string) => {
		const foundStreams = await queryClient.fetchQuery(
			streamQueries.similar({
				query: name,
				limit: STREAM_SEARCH_LIMIT,
			}),
		);

		return foundStreams.find((stream) => isSameStreamName(stream, name));
	};

	const findRequiredStream = async (name: string) => {
		const stream = await findExistingStream(name);

		if (!stream) {
			throw new Error('Stream was not found');
		}

		return stream;
	};

	const getOrCreateStream = async (name: string) => {
		const existingStream = await findExistingStream(name);

		if (existingStream) {
			return existingStream;
		}

		try {
			const createdStream: unknown =
				await createStreamMutation.mutateAsync({ name });

			if (isStreamResponse(createdStream)) {
				return createdStream;
			}

			if (createdStream === true) {
				return await findRequiredStream(name);
			}

			throw new Error('Unexpected create stream response');
		} catch (error) {
			if (isConflictError(error)) {
				return await findRequiredStream(name);
			}

			throw error;
		}
	};

	const addStream: React.SubmitEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault();

		const name = streamName.trim();

		if (!name || isDisabled) {
			return;
		}

		if (name.length > MAX_STREAM_NAME_LENGTH) {
			showError('Название потока слишком длинное');
			return;
		}

		if (
			streams.some(
				(stream) =>
					normalizeStreamName(stream.name) === normalizedStreamName,
			)
		) {
			showError('Поток уже привязан к заметке');
			return;
		}

		try {
			const stream = await getOrCreateStream(name);
			await attachNoteToStreamMutation.mutateAsync({
				streamId: stream.id,
				noteId,
			});
			setStreamName('');
		} catch {
			showError('Не удалось привязать поток');
		}
	};

	const detachStream = async (streamId: string) => {
		if (isDisabled) {
			return;
		}

		try {
			await detachNoteFromStreamMutation.mutateAsync({
				streamId,
				noteId,
			});
		} catch {
			showError('Не удалось отвязать поток');
		}
	};

	return (
		<Stack
			component="section"
			direction="row"
			sx={{
				minWidth: 0,
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: 1,
				px: 2.75,
				pt: 0.5,
			}}
		>
			<Stack
				direction="row"
				sx={{
					minWidth: 0,
					flex: '1 1 240px',
					flexWrap: 'wrap',
					gap: 0.75,
				}}
			>
				{streams.map((stream) => (
					<Chip
						key={stream.id}
						label={stream.name}
						variant="outlined"
						size="small"
						disabled={isPending}
						onDelete={
							isDisabled
								? undefined
								: () => {
										void detachStream(stream.id);
									}
						}
						sx={{
							maxWidth: 220,
							borderRadius: 1,
							'& .MuiChip-label': {
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							},
						}}
					/>
				))}
				<Box
					component="form"
					onSubmit={addStream}
					sx={{ p: 0 }}
				>
					<InputBase
						value={streamName}
						placeholder="Поток"
						size="small"
						disabled={isDisabled}
						onChange={(e) => setStreamName(e.target.value)}
						slotProps={{
							input: {
								maxLength: MAX_STREAM_NAME_LENGTH,
							},
						}}
					/>
				</Box>
			</Stack>
		</Stack>
	);
};
