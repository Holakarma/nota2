import type { SignInRequestDto, SignUpRequestDto } from '@shared/api';
import { z } from 'zod';

export type SignUpFormValues = SignUpRequestDto & {
	passwordRepeat: string;
};

const loginRule = z
	.string()
	.min(8, 'Логин должен быть не короче 8 символов')
	.max(255, 'Логин должен быть не длиннее 255 символов');

const passwordRule = z
	.string()
	.min(8, 'Пароль должен быть не короче 8 символов')
	.max(128, 'Пароль должен быть не длиннее 128 символов');

export const SignInSchema = z.object({
	login: loginRule,
	password: passwordRule,
}) satisfies z.ZodType<SignInRequestDto>;

export const SignUpSchema = z
	.object({
		login: loginRule,
		password: passwordRule,
		passwordRepeat: passwordRule,
	})
	.refine((values) => values.password === values.passwordRepeat, {
		path: ['passwordRepeat'],
		message: 'Пароли должны совпадать',
	}) satisfies z.ZodType<SignUpFormValues>;

export type TypeSignInSchema = z.infer<typeof SignInSchema>;
export type TypeSignUpSchema = z.infer<typeof SignUpSchema>;
