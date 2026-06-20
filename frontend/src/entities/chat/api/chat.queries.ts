import {
	infiniteQueryOptions,
	keepPreviousData,
	queryOptions,
} from '@tanstack/react-query';
import {
	api,
	ChatControllerEnsureData,
	compactQueryParams,
	CreateChatDto,
	getNextCursorPageParam,
	type ChatControllerFindAllData,
	type ChatControllerFindAllParams,
	type ChatControllerFindMessagesData,
	type ChatControllerFindMessagesParams,
} from '@shared/api';
import {
	ChatFindAllParamsSchema,
	ChatFindMessagesParamsSchema,
} from './chat.schemas';

export type ChatListInfiniteParams = Omit<
	ChatControllerFindAllParams,
	'cursor'
>;

export type ChatMessagesInfiniteParams = Omit<
	ChatControllerFindMessagesParams,
	'cursor'
>;

const getChatMessagePageParams = ({
	cursor,
	limit,
}: ChatControllerFindMessagesParams) => compactQueryParams({ cursor, limit });

const getChatMessageInfiniteParams = ({
	limit,
}: ChatMessagesInfiniteParams) => compactQueryParams({ limit });

export const chatQueryKeys = {
	all: () => ['chat'] as const,
	lists: () => [...chatQueryKeys.all(), 'list'] as const,
	list: (query: ChatControllerFindAllParams = {}) =>
		[...chatQueryKeys.lists(), compactQueryParams(query)] as const,
	infiniteList: (query: ChatListInfiniteParams = {}) =>
		[...chatQueryKeys.lists(), 'infinite', compactQueryParams(query)] as const,
	general: () => [...chatQueryKeys.all(), 'general'] as const,
	byStream: (data: CreateChatDto) =>
		[...chatQueryKeys.all(), 'by-stream', data.streamId] as const,
	messages: (chatId: string) =>
		[...chatQueryKeys.all(), 'messages', chatId] as const,
	messageList: (query: ChatControllerFindMessagesParams) =>
		[
			...chatQueryKeys.messages(query.chatId),
			'list',
			getChatMessagePageParams(query),
		] as const,
	messageInfinite: (query: ChatMessagesInfiniteParams) =>
		[
			...chatQueryKeys.messages(query.chatId),
			'infinite',
			getChatMessageInfiniteParams(query),
		] as const,
};

export const getChats = async (
	query: ChatControllerFindAllParams = {},
	signal?: AbortSignal,
): Promise<ChatControllerFindAllData> => {
	const validQuery = ChatFindAllParamsSchema.parse(query);
	const response = await api.chat.chatControllerFindAll(validQuery, { signal });

	return response.data;
};

export const getChatByStream = async (
	data: CreateChatDto,
	signal?: AbortSignal,
): Promise<ChatControllerEnsureData> => {
	const response = await api.chat.chatControllerEnsure(data, {
		signal,
	});

	return response.data;
};

export const getChatMessages = async (
	query: ChatControllerFindMessagesParams,
	signal?: AbortSignal,
): Promise<ChatControllerFindMessagesData> => {
	const validQuery = ChatFindMessagesParamsSchema.parse(query);
	const response = await api.chat.chatControllerFindMessages(validQuery, {
		signal,
	});

	return response.data;
};

export const chatQueries = {
	list: (query: ChatControllerFindAllParams = {}) =>
		queryOptions({
			queryKey: chatQueryKeys.list(query),
			queryFn: ({ signal }) => getChats(query, signal),
			placeholderData: keepPreviousData,
		}),
	byStream: (data: CreateChatDto = {}) =>
		queryOptions({
			queryKey: chatQueryKeys.byStream(data),
			queryFn: ({ signal }) => getChatByStream(data, signal),
		}),
	infiniteList: (query: ChatListInfiniteParams = {}) =>
		infiniteQueryOptions({
			queryKey: chatQueryKeys.infiniteList(query),
			queryFn: ({ pageParam, signal }) =>
				getChats({ ...query, cursor: pageParam }, signal),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: getNextCursorPageParam,
		}),
	messages: (query: ChatControllerFindMessagesParams) =>
		queryOptions({
			queryKey: chatQueryKeys.messageList(query),
			queryFn: ({ signal }) => getChatMessages(query, signal),
			placeholderData: keepPreviousData,
		}),
	messagesInfinite: (query: ChatMessagesInfiniteParams) =>
		infiniteQueryOptions({
			queryKey: chatQueryKeys.messageInfinite(query),
			queryFn: ({ pageParam, signal }) =>
				getChatMessages({ ...query, cursor: pageParam }, signal),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: getNextCursorPageParam,
		}),
};

