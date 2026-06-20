import {
	useMutation,
	useQueryClient,
	type UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
	api,
	type CreateNoteDto,
	type NoteControllerCreateData,
	type NoteControllerRemoveData,
	type NoteControllerRemoveParams,
	type NoteControllerUpdateData,
	type NoteControllerUpdateParams,
	type UpdateNoteDto,
} from '@shared/api';
import {
	CreateNoteSchema,
	NoteRemoveParamsSchema,
	NoteUpdateParamsSchema,
	UpdateNoteSchema,
} from './note.schemas';
import { noteQueryKeys } from './note.queries';

export type UpdateNoteVariables = NoteControllerUpdateParams & {
	data: UpdateNoteDto;
};

type CreateNoteMutationOptions = Omit<
	UseMutationOptions<NoteControllerCreateData, AxiosError<void>, CreateNoteDto>,
	'mutationFn' | 'mutationKey'
>;

type UpdateNoteMutationOptions = Omit<
	UseMutationOptions<
		NoteControllerUpdateData,
		AxiosError<void>,
		UpdateNoteVariables
	>,
	'mutationFn' | 'mutationKey'
>;

type RemoveNoteMutationOptions = Omit<
	UseMutationOptions<
		NoteControllerRemoveData,
		AxiosError<void>,
		NoteControllerRemoveParams
	>,
	'mutationFn' | 'mutationKey'
>;

export const noteMutationKeys = {
	all: () => [...noteQueryKeys.all(), 'mutation'] as const,
	create: () => [...noteMutationKeys.all(), 'create'] as const,
	update: (id?: string) => [...noteMutationKeys.all(), 'update', id] as const,
	remove: (id?: string) => [...noteMutationKeys.all(), 'remove', id] as const,
};

export const createNote = async (
	data: CreateNoteDto,
): Promise<NoteControllerCreateData> => {
	const validData = CreateNoteSchema.parse(data);
	const response = await api.note.noteControllerCreate(validData);

	return response.data;
};

export const updateNote = async ({
	id,
	data,
}: UpdateNoteVariables): Promise<NoteControllerUpdateData> => {
	const validParams = NoteUpdateParamsSchema.parse({ id });
	const validData = UpdateNoteSchema.parse(data);
	const response = await api.note.noteControllerUpdate(validParams, validData);

	return response.data;
};

export const removeNote = async (
	query: NoteControllerRemoveParams,
): Promise<NoteControllerRemoveData> => {
	const validQuery = NoteRemoveParamsSchema.parse(query);
	const response = await api.note.noteControllerRemove(validQuery);

	return response.data;
};

export const useCreateNoteMutation = (options?: CreateNoteMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: noteMutationKeys.create(),
		mutationFn: createNote,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }),
				queryClient.invalidateQueries({ queryKey: noteQueryKeys.similar() }),
			]);
			await options?.onSuccess?.(data, variables, onMutateResult, context);
		},
	});
};

export const useUpdateNoteMutation = (options?: UpdateNoteMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: noteMutationKeys.update(),
		mutationFn: updateNote,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: noteQueryKeys.detail(variables.id),
				}),
				queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }),
				queryClient.invalidateQueries({ queryKey: noteQueryKeys.similar() }),
			]);
			await options?.onSuccess?.(data, variables, onMutateResult, context);
		},
	});
};

export const useRemoveNoteMutation = (options?: RemoveNoteMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: noteMutationKeys.remove(),
		mutationFn: removeNote,
		onSuccess: async (data, variables, onMutateResult, context) => {
			queryClient.removeQueries({
				queryKey: noteQueryKeys.detail(variables.id),
			});
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: noteQueryKeys.lists() }),
				queryClient.invalidateQueries({ queryKey: noteQueryKeys.similar() }),
			]);
			await options?.onSuccess?.(data, variables, onMutateResult, context);
		},
	});
};
