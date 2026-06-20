import {
	infiniteQueryOptions,
	keepPreviousData,
	queryOptions,
} from '@tanstack/react-query';
import {
	api,
	compactQueryParams,
	getNextCursorPageParam,
	type NoteStreamControllerFindNotesData,
	type NoteStreamControllerFindNotesParams,
	type StreamControllerFindAllData,
	type StreamControllerFindAllParams,
	type StreamControllerFindOneData,
	type StreamControllerFindOneParams,
	type StreamControllerFindSimilarData,
	type StreamControllerFindSimilarParams,
} from '@shared/api';
import {
	StreamFindAllParamsSchema,
	StreamFindSimilarParamsSchema,
	StreamFindNotesParamsSchema,
	StreamFindOneParamsSchema,
} from './stream.schemas';

export type StreamListInfiniteParams = Omit<
	StreamControllerFindAllParams,
	'cursor'
>;

export type StreamNotesInfiniteParams = Omit<
	NoteStreamControllerFindNotesParams,
	'cursor'
>;

const getStreamNotesPageParams = ({
	cursor,
	limit,
}: NoteStreamControllerFindNotesParams) => compactQueryParams({ cursor, limit });

const getStreamNotesInfiniteParams = ({
	limit,
}: StreamNotesInfiniteParams) => compactQueryParams({ limit });

export const streamQueryKeys = {
	all: () => ['stream'] as const,
	lists: () => [...streamQueryKeys.all(), 'list'] as const,
	list: (query: StreamControllerFindAllParams = {}) =>
		[...streamQueryKeys.lists(), compactQueryParams(query)] as const,
	infiniteList: (query: StreamListInfiniteParams = {}) =>
		[...streamQueryKeys.lists(), 'infinite', compactQueryParams(query)] as const,
	similar: () => [...streamQueryKeys.all(), 'similar'] as const,
	similarList: (query: StreamControllerFindSimilarParams) =>
		[...streamQueryKeys.similar(), compactQueryParams(query)] as const,
	details: () => [...streamQueryKeys.all(), 'detail'] as const,
	detail: (id: string) => [...streamQueryKeys.details(), id] as const,
	notes: (streamId: string) => [...streamQueryKeys.detail(streamId), 'note'] as const,
	noteList: (query: NoteStreamControllerFindNotesParams) =>
		[
			...streamQueryKeys.notes(query.streamId),
			'list',
			getStreamNotesPageParams(query),
		] as const,
	noteInfinite: (query: StreamNotesInfiniteParams) =>
		[
			...streamQueryKeys.notes(query.streamId),
			'infinite',
			getStreamNotesInfiniteParams(query),
		] as const,
};

export const getStreams = async (
	query: StreamControllerFindAllParams = {},
	signal?: AbortSignal,
): Promise<StreamControllerFindAllData> => {
	const validQuery = StreamFindAllParamsSchema.parse(query);
	const response = await api.stream.streamControllerFindAll(validQuery, {
		signal,
	});

	return response.data;
};

export const getSimilarStreams = async (
	query: StreamControllerFindSimilarParams,
	signal?: AbortSignal,
): Promise<StreamControllerFindSimilarData> => {
	const validQuery = StreamFindSimilarParamsSchema.parse(query);
	const response = await api.stream.streamControllerFindSimilar(validQuery, {
		signal,
	});

	return response.data;
};

export const getStream = async (
	query: StreamControllerFindOneParams,
	signal?: AbortSignal,
): Promise<StreamControllerFindOneData> => {
	const validQuery = StreamFindOneParamsSchema.parse(query);
	const response = await api.stream.streamControllerFindOne(validQuery, {
		signal,
	});

	return response.data;
};

export const getStreamNotes = async (
	query: NoteStreamControllerFindNotesParams,
	signal?: AbortSignal,
): Promise<NoteStreamControllerFindNotesData> => {
	const validQuery = StreamFindNotesParamsSchema.parse(query);
	const response = await api.stream.noteStreamControllerFindNotes(validQuery, {
		signal,
	});

	return response.data;
};

export const streamQueries = {
	list: (query: StreamControllerFindAllParams = {}) =>
		queryOptions({
			queryKey: streamQueryKeys.list(query),
			queryFn: ({ signal }) => getStreams(query, signal),
			placeholderData: keepPreviousData,
		}),
	infiniteList: (query: StreamListInfiniteParams = {}) =>
		infiniteQueryOptions({
			queryKey: streamQueryKeys.infiniteList(query),
			queryFn: ({ pageParam, signal }) =>
				getStreams({ ...query, cursor: pageParam }, signal),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: getNextCursorPageParam,
		}),
	similar: (query: StreamControllerFindSimilarParams) =>
		queryOptions({
			queryKey: streamQueryKeys.similarList(query),
			queryFn: ({ signal }) => getSimilarStreams(query, signal),
		}),
	detail: (query: StreamControllerFindOneParams) =>
		queryOptions({
			queryKey: streamQueryKeys.detail(query.id),
			queryFn: ({ signal }) => getStream(query, signal),
		}),
	notes: (query: NoteStreamControllerFindNotesParams) =>
		queryOptions({
			queryKey: streamQueryKeys.noteList(query),
			queryFn: ({ signal }) => getStreamNotes(query, signal),
			placeholderData: keepPreviousData,
		}),
	notesInfinite: (query: StreamNotesInfiniteParams) =>
		infiniteQueryOptions({
			queryKey: streamQueryKeys.noteInfinite(query),
			queryFn: ({ pageParam, signal }) =>
				getStreamNotes({ ...query, cursor: pageParam }, signal),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: getNextCursorPageParam,
		}),
};
