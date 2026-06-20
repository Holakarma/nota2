export type CursorPaginatedResponse = {
	page: {
		hasNextPage: boolean;
		nextCursor: string | null;
	};
};

export const getNextCursorPageParam = (
	lastPage: CursorPaginatedResponse,
): string | undefined =>
	lastPage.page.hasNextPage ? (lastPage.page.nextCursor ?? undefined) : undefined;

export const compactQueryParams = <TQuery extends object>(
	query?: TQuery,
): Partial<TQuery> =>
	Object.fromEntries(
		Object.entries(query ?? {}).filter(([, value]) => value !== undefined),
	) as Partial<TQuery>;
