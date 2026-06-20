import { queryOptions } from '@tanstack/react-query';
import { api } from '@shared/api';
import { CurrentUserSchema, type CurrentUser } from './user.schemas';

export const currentUserQueryKeys = {
	all: () => ['user', 'current'] as const,
};

const getCurrentUser = async (
	signal?: AbortSignal,
): Promise<CurrentUser> => {
	const response = await api.auth.authControllerMe({
		secure: true,
		format: 'json',
		signal,
	});

	return CurrentUserSchema.parse(response.data);
};

export const currentUserQueries = {
	me: () =>
		queryOptions({
			queryKey: currentUserQueryKeys.all(),
			queryFn: ({ signal }) => getCurrentUser(signal),
		}),
};
