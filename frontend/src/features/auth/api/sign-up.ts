import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
	api,
	type AuthControllerSignUpData,
	type SignUpRequestDto,
} from '@shared/api';

type SignUpMutationOptions = Omit<
	UseMutationOptions<
		AuthControllerSignUpData,
		AxiosError<void>,
		SignUpRequestDto
	>,
	'mutationFn'
>;

export const useSignUpMutation = (options?: SignUpMutationOptions) =>
	useMutation({
		...options,
		mutationFn: async (data) => {
			const response = await api.auth.authControllerSignUp(data);

			return response.data;
		},
	});
