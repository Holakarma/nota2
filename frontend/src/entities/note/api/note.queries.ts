import {
	infiniteQueryOptions,
	keepPreviousData,
	queryOptions,
} from '@tanstack/react-query';
import {
	api,
	compactQueryParams,
	getNextCursorPageParam,
	type NoteControllerFindAllData,
	type NoteControllerFindAllParams,
	type NoteControllerFindOneData,
	type NoteControllerFindOneParams,
	type NoteControllerFindSimilarData,
	type NoteControllerFindSimilarParams,
} from '@shared/api';
import {
	NoteFindAllParamsSchema,
	NoteFindOneParamsSchema,
	NoteFindSimilarParamsSchema,
} from './note.schemas';

export type NoteListInfiniteParams = Omit<
	NoteControllerFindAllParams,
	'cursor'
>;

export const noteQueryKeys = {
	all: () => ['note'] as const,
	lists: () => [...noteQueryKeys.all(), 'list'] as const,
	list: (query: NoteControllerFindAllParams = {}) =>
		[...noteQueryKeys.lists(), compactQueryParams(query)] as const,
	infiniteList: (query: NoteListInfiniteParams = {}) =>
		[
			...noteQueryKeys.lists(),
			'infinite',
			compactQueryParams(query),
		] as const,
	similar: () => [...noteQueryKeys.all(), 'similar'] as const,
	similarList: (query: NoteControllerFindSimilarParams) =>
		[...noteQueryKeys.similar(), compactQueryParams(query)] as const,
	details: () => [...noteQueryKeys.all(), 'detail'] as const,
	detail: (id: string) => [...noteQueryKeys.details(), id] as const,
};

export const getNotes = async (
	query: NoteControllerFindAllParams = {},
	signal?: AbortSignal,
): Promise<NoteControllerFindAllData> => {
	const validQuery = NoteFindAllParamsSchema.parse(query);
	const response = await api.note.noteControllerFindAll(validQuery, {
		signal,
	});

	return response.data;
};

export const getSimilarNotes = async (
	query: NoteControllerFindSimilarParams,
	signal?: AbortSignal,
): Promise<NoteControllerFindSimilarData> => {
	const validQuery = NoteFindSimilarParamsSchema.parse(query);
	const response = await api.note.noteControllerFindSimilar(validQuery, {
		signal,
	});

	return response.data;
};

export const getNote = async (
	query: NoteControllerFindOneParams,
	signal?: AbortSignal,
): Promise<NoteControllerFindOneData> => {
	const validQuery = NoteFindOneParamsSchema.parse(query);
	const response = await api.note.noteControllerFindOne(validQuery, {
		signal,
	});

	return response.data;
};

export const noteQueries = {
	list: (query: NoteControllerFindAllParams = {}) =>
		queryOptions({
			queryKey: noteQueryKeys.list(query),
			queryFn: ({ signal }) => getNotes(query, signal),
			placeholderData: keepPreviousData,
		}),
	infiniteList: (query: NoteListInfiniteParams = {}) =>
		infiniteQueryOptions({
			queryKey: noteQueryKeys.infiniteList(query),
			queryFn: ({ pageParam, signal }) =>
				getNotes({ ...query, cursor: pageParam }, signal),
			initialPageParam: undefined as string | undefined,
			getNextPageParam: getNextCursorPageParam,
		}),
	similar: (query: NoteControllerFindSimilarParams) =>
		queryOptions({
			queryKey: noteQueryKeys.similarList(query),
			queryFn: ({ signal }) => getSimilarNotes(query, signal),
		}),
	detail: (query: NoteControllerFindOneParams) =>
		queryOptions({
			queryKey: noteQueryKeys.detail(query.id),
			queryFn: ({ signal }) => getNote(query, signal),
			staleTime: 2 * 60_000,
		}),
};
