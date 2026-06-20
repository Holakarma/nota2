import {
	useMutation,
	useQueryClient,
	type InfiniteData,
	type UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
	api,
	type ChatControllerCreateData,
	type ChatControllerCreateMessageData,
	type ChatControllerCreateMessageParams,
	type ChatControllerEnsureData,
	type ChatControllerFindMessagesData,
	type CreateChatDto,
	type CreateChatMessageDto,
} from '@shared/api';
import {
	ChatCreateMessageParamsSchema,
	CreateChatMessageSchema,
	CreateChatSchema,
} from './chat.schemas';
import { chatQueryKeys } from './chat.queries';
import { streamQueryKeys } from '@entities/stream';
import { noteQueryKeys } from '@entities/note';

export type CreateChatMessageVariables = ChatControllerCreateMessageParams & {
	data: CreateChatMessageDto;
};

type CreateChatMutationOptions = Omit<
	UseMutationOptions<
		ChatControllerCreateData,
		AxiosError<void>,
		CreateChatDto
	>,
	'mutationFn' | 'mutationKey'
>;

type CreateChatMessageMutationOptions = Omit<
	UseMutationOptions<
		ChatControllerCreateMessageData,
		AxiosError<void>,
		CreateChatMessageVariables
	>,
	'mutationFn' | 'mutationKey'
>;

type EnsureChatMutationOptions = Omit<
	UseMutationOptions<
		ChatControllerEnsureData,
		AxiosError<void>,
		CreateChatDto
	>,
	'mutationFn' | 'mutationKey'
>;

export const chatMutationKeys = {
	all: () => [...chatQueryKeys.all(), 'mutation'] as const,
	create: () => [...chatMutationKeys.all(), 'create'] as const,
	ensure: () => [...chatMutationKeys.all(), 'ensure'] as const,
	createMessage: (chatId?: string) =>
		[...chatMutationKeys.all(), 'create-message', chatId] as const,
};

export const createChat = async (
	data: CreateChatDto,
): Promise<ChatControllerCreateData> => {
	const validData = CreateChatSchema.parse(data);
	const response = await api.chat.chatControllerCreate(validData);

	return response.data;
};

export const ensureChat = async (
	data: CreateChatDto,
): Promise<ChatControllerEnsureData> => {
	const validData = CreateChatSchema.parse(data);
	const response = await api.chat.chatControllerEnsure(validData);

	return response.data;
};

export const createChatMessage = async ({
	chatId,
	data,
}: CreateChatMessageVariables): Promise<ChatControllerCreateMessageData> => {
	const validParams = ChatCreateMessageParamsSchema.parse({ chatId });
	const validData = CreateChatMessageSchema.parse(data);
	const response = await api.chat.chatControllerCreateMessage(
		validParams,
		validData,
	);

	return response.data;
};

export const useCreateChatMutation = (options?: CreateChatMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: chatMutationKeys.create(),
		mutationFn: createChat,
		onSuccess: async (data, variables, onMutateResult, context) => {
			queryClient.setQueryData(chatQueryKeys.lists(), data);
			await queryClient.invalidateQueries({
				queryKey: chatQueryKeys.lists(),
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

export const useEnsureChatMutation = (options?: EnsureChatMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: chatMutationKeys.ensure(),
		mutationFn: ensureChat,
		onSuccess: async (data, variables, onMutateResult, context) => {
			queryClient.setQueryData(chatQueryKeys.byStream(variables), data);
			await queryClient.invalidateQueries({
				queryKey: chatQueryKeys.lists(),
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

export const useCreateChatMessageMutation = (
	options?: CreateChatMessageMutationOptions,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: chatMutationKeys.createMessage(),
		mutationFn: createChatMessage,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await Promise.all([
				queryClient.setQueryData<
					InfiniteData<ChatControllerFindMessagesData> | undefined
				>(
					chatQueryKeys.messageInfinite({ chatId: variables.chatId }),
					(oldData) => {
						if (!oldData?.pages.length) {
							return oldData;
						}

						const [first, ...rest] = oldData.pages;

						return {
							...oldData,
							pages: [
								{ ...first, result: [data, ...first.result] },
								...rest,
							],
						};
					},
				),
				queryClient.invalidateQueries({
					queryKey: chatQueryKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: streamQueryKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: noteQueryKeys.lists(),
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
