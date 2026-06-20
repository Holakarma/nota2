import { noteQueries } from '@entities/note';
import { streamQueries } from '@entities/stream';
import { useThrottledState } from '@shared/lib/throttled-state';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type UseSearchParams = {
	query?: string;
	limit?: number;
};

const SEARCH_THROTTLE_MS = 500;
const MAX_SEARCH_QUERY_LENGTH = 500;
const STREAM_SEARCH_PREFIX = ':';

const normalizeSearchQuery = (query: string) =>
	query.trim().slice(0, MAX_SEARCH_QUERY_LENGTH);

export const useSearch = ({ query = '', limit }: UseSearchParams) => {
	const trimmedQuery = query.trim();
	const isStreamSearch = trimmedQuery.startsWith(STREAM_SEARCH_PREFIX);
	const rawSearchQuery = isStreamSearch
		? trimmedQuery.slice(STREAM_SEARCH_PREFIX.length)
		: trimmedQuery;
	const searchQuery = normalizeSearchQuery(rawSearchQuery);

	const throttledQuery = useThrottledState(searchQuery, SEARCH_THROTTLE_MS);
	const similarQueryParams = {
		query: throttledQuery,
		limit,
	};
	const hasQuery = Boolean(searchQuery && throttledQuery);

	const notesQuery = useQuery({
		...noteQueries.similar(similarQueryParams),
		enabled: !isStreamSearch && hasQuery,
		placeholderData: keepPreviousData,
	});

	const streamsQuery = useQuery({
		...streamQueries.similar(similarQueryParams),
		enabled: isStreamSearch && hasQuery,
		placeholderData: keepPreviousData,
	});

	return {
		notesQuery,
		streamsQuery,
	};
};
