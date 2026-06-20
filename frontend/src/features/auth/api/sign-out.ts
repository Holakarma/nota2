import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { api, type AuthControllerLogoutData } from '@shared/api';
import { clearAccessToken } from '@shared/auth';

type SignOutMutationOptions = Omit<
	UseMutationOptions<AuthControllerLogoutData, AxiosError<void>>,
	'mutationFn'
>;

export const useSignOutMutation = (options?: SignOutMutationOptions) =>
	useMutation({
		...options,
		mutationFn: async () => {
			clearAccessToken();
			const response = await api.auth.authControllerLogout();
			return response.data;
		},
	});
