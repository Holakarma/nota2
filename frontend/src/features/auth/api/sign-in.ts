import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
	api,
	type AuthControllerSignInData,
	type SignInRequestDto,
} from '@shared/api';

type SignInMutationOptions = Omit<
	UseMutationOptions<
		AuthControllerSignInData,
		AxiosError<void>,
		SignInRequestDto
	>,
	'mutationFn'
>;

export const useSignInMutation = (options?: SignInMutationOptions) =>
	useMutation({
		...options,
		mutationFn: async (data) => {
			const response = await api.auth.authControllerSignIn(data);

			return response.data;
		},
	});
