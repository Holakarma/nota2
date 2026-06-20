import {
	useMutation,
	useQueryClient,
	type UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
	api,
	type CreateStreamDto,
	type NoteStreamControllerAttachNoteData,
	type NoteStreamControllerAttachNoteParams,
	type NoteStreamControllerDetachNoteData,
	type NoteStreamControllerDetachNoteParams,
	type StreamControllerCreateData,
	type StreamControllerRemoveData,
	type StreamControllerRemoveParams,
	type StreamControllerUpdateData,
	type StreamControllerUpdateParams,
	type UpdateStreamDto,
} from '@shared/api';
import {
	AttachNoteToStreamParamsSchema,
	CreateStreamSchema,
	DetachNoteFromStreamParamsSchema,
	StreamRemoveParamsSchema,
	StreamUpdateParamsSchema,
	UpdateStreamSchema,
} from './stream.schemas';
import { streamQueryKeys } from './stream.queries';

export type UpdateStreamVariables = StreamControllerUpdateParams & {
	data: UpdateStreamDto;
};

type CreateStreamMutationOptions = Omit<
	UseMutationOptions<
		StreamControllerCreateData,
		AxiosError<void>,
		CreateStreamDto
	>,
	'mutationFn' | 'mutationKey'
>;

type UpdateStreamMutationOptions = Omit<
	UseMutationOptions<
		StreamControllerUpdateData,
		AxiosError<void>,
		UpdateStreamVariables
	>,
	'mutationFn' | 'mutationKey'
>;

type RemoveStreamMutationOptions = Omit<
	UseMutationOptions<
		StreamControllerRemoveData,
		AxiosError<void>,
		StreamControllerRemoveParams
	>,
	'mutationFn' | 'mutationKey'
>;

type AttachNoteToStreamMutationOptions = Omit<
	UseMutationOptions<
		NoteStreamControllerAttachNoteData,
		AxiosError<void>,
		NoteStreamControllerAttachNoteParams
	>,
	'mutationFn' | 'mutationKey'
>;

type DetachNoteFromStreamMutationOptions = Omit<
	UseMutationOptions<
		NoteStreamControllerDetachNoteData,
		AxiosError<void>,
		NoteStreamControllerDetachNoteParams
	>,
	'mutationFn' | 'mutationKey'
>;

export const streamMutationKeys = {
	all: () => [...streamQueryKeys.all(), 'mutation'] as const,
	create: () => [...streamMutationKeys.all(), 'create'] as const,
	update: (id?: string) =>
		[...streamMutationKeys.all(), 'update', id] as const,
	remove: (id?: string) =>
		[...streamMutationKeys.all(), 'remove', id] as const,
	attachNote: (streamId?: string, noteId?: string) =>
		[...streamMutationKeys.all(), 'attach-note', streamId, noteId] as const,
	detachNote: (streamId?: string, noteId?: string) =>
		[...streamMutationKeys.all(), 'detach-note', streamId, noteId] as const,
};

export const createStream = async (
	data: CreateStreamDto,
): Promise<StreamControllerCreateData> => {
	const validData = CreateStreamSchema.parse(data);
	const response = await api.stream.streamControllerCreate(validData);

	return response.data;
};

export const updateStream = async ({
	id,
	data,
}: UpdateStreamVariables): Promise<StreamControllerUpdateData> => {
	const validParams = StreamUpdateParamsSchema.parse({ id });
	const validData = UpdateStreamSchema.parse(data);
	const response = await api.stream.streamControllerUpdate(
		validParams,
		validData,
	);

	return response.data;
};

export const removeStream = async (
	query: StreamControllerRemoveParams,
): Promise<StreamControllerRemoveData> => {
	const validQuery = StreamRemoveParamsSchema.parse(query);
	const response = await api.stream.streamControllerRemove(validQuery);

	return response.data;
};

export const attachNoteToStream = async (
	query: NoteStreamControllerAttachNoteParams,
): Promise<NoteStreamControllerAttachNoteData> => {
	const validQuery = AttachNoteToStreamParamsSchema.parse(query);
	const response =
		await api.stream.noteStreamControllerAttachNote(validQuery);

	return response.data;
};

export const detachNoteFromStream = async (
	query: NoteStreamControllerDetachNoteParams,
): Promise<NoteStreamControllerDetachNoteData> => {
	const validQuery = DetachNoteFromStreamParamsSchema.parse(query);
	const response =
		await api.stream.noteStreamControllerDetachNote(validQuery);

	return response.data;
};

export const useCreateStreamMutation = (
	options?: CreateStreamMutationOptions,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: streamMutationKeys.create(),
		mutationFn: createStream,
		onSuccess: async (data, variables, onMutateResult, context) => {
			queryClient.setQueryData(streamQueryKeys.detail(data.id), data);
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.similar(),
				}),
			]);
			await options?.onSuccess?.(
				data,
				variables,
				onMutateResult,
				context,
			);
		},
	});
};

export const useUpdateStreamMutation = (
	options?: UpdateStreamMutationOptions,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: streamMutationKeys.update(),
		mutationFn: updateStream,
		onSuccess: async (data, variables, onMutateResult, context) => {
			queryClient.setQueryData(
				streamQueryKeys.detail(variables.id),
				data,
			);
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.detail(variables.id),
				}),
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.notes(variables.id),
				}),
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.similar(),
				}),
			]);
			await options?.onSuccess?.(
				data,
				variables,
				onMutateResult,
				context,
			);
		},
	});
};

export const useRemoveStreamMutation = (
	options?: RemoveStreamMutationOptions,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: streamMutationKeys.remove(),
		mutationFn: removeStream,
		onSuccess: async (data, variables, onMutateResult, context) => {
			queryClient.removeQueries({
				queryKey: streamQueryKeys.detail(variables.id),
			});
			queryClient.removeQueries({
				queryKey: streamQueryKeys.notes(variables.id),
			});
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.similar(),
				}),
			]);
			await options?.onSuccess?.(
				data,
				variables,
				onMutateResult,
				context,
			);
		},
	});
};

export const useAttachNoteToStreamMutation = (
	options?: AttachNoteToStreamMutationOptions,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: streamMutationKeys.attachNote(),
		mutationFn: attachNoteToStream,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await queryClient.invalidateQueries({
				queryKey: streamQueryKeys.notes(variables.streamId),
			});
			await options?.onSuccess?.(
				data,
				variables,
				onMutateResult,
				context,
			);
		},
	});
};

export const useDetachNoteFromStreamMutation = (
	options?: DetachNoteFromStreamMutationOptions,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: streamMutationKeys.detachNote(),
		mutationFn: detachNoteFromStream,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await queryClient.invalidateQueries({
				queryKey: streamQueryKeys.notes(variables.streamId),
			});
			await options?.onSuccess?.(
				data,
				variables,
				onMutateResult,
				context,
			);
		},
	});
};
