import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField } from '@mui/material';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSignUpMutation } from '../api';
import { getSignUpErrorMessage } from '../model/auth-error';
import { SignUpSchema, type TypeSignUpSchema } from '../model/schemes';
import { AuthFormWidget } from './auth-form.widget';

export const RegisterForm = () => {
	const navigate = useNavigate();
	const [isServerErrorOpen, setIsServerErrorOpen] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TypeSignUpSchema>({
		defaultValues: {
			login: '',
			password: '',
			passwordRepeat: '',
		},
		resolver: zodResolver(SignUpSchema),
	});

	const signUpMutation = useSignUpMutation({
		onSuccess: () => {
			void navigate({
				to: routeConfig.chat,
				params: { streamId: DEFAULT_STREAM_ROUTE_PARAM },
				replace: true,
			});
		},
	});

	const isPending = signUpMutation.isPending;
	const serverError = getSignUpErrorMessage(signUpMutation.error);

	useEffect(() => {
		if (serverError) {
			setIsServerErrorOpen(true);
		}
	}, [serverError]);

	const submitForm = (values: TypeSignUpSchema) => {
		signUpMutation.mutate({
			login: values.login,
			password: values.password,
		});
	};

	return (
		<AuthFormWidget
			openSnackbar={isServerErrorOpen && Boolean(serverError)}
			onCloseSnackbar={() => setIsServerErrorOpen(false)}
			snackbarMessage={serverError}
		>
			<Stack
				component="form"
				onSubmit={handleSubmit(submitForm)}
				spacing={2}
			>
				<TextField
					fullWidth
					{...register('login')}
					disabled={isPending}
					helperText={errors.login?.message}
					error={!!errors.login}
					autoComplete="username"
					placeholder="Логин"
					aria-label="Логин"
					aria-invalid={Boolean(errors.login)}
					aria-describedby={errors.login ? 'login-error' : undefined}
				/>

				<TextField
					{...register('password')}
					fullWidth
					type="password"
					disabled={isPending}
					helperText={errors.password?.message}
					error={!!errors.password}
					autoComplete="new-password"
					placeholder="Пароль"
					aria-label="Пароль"
					aria-invalid={Boolean(errors.password)}
					aria-describedby={
						errors.password ? 'password-error' : undefined
					}
				/>

				<TextField
					{...register('passwordRepeat')}
					fullWidth
					type="password"
					disabled={isPending}
					helperText={errors.passwordRepeat?.message}
					error={!!errors.passwordRepeat}
					autoComplete="new-password"
					placeholder="Повторите пароль"
					aria-label="Повторите пароль"
					aria-describedby={
						errors.passwordRepeat
							? 'password-repeat-error'
							: undefined
					}
				/>

				<Stack spacing={1}>
					<Button
						fullWidth
						variant="contained"
						type="submit"
						loading={isPending}
					>
						Зарегистрироваться
					</Button>

					<Button
						fullWidth
						component={Link}
						to="/login"
						variant="outlined"
						disabled={isPending}
					>
						Войти в аккаунт
					</Button>
				</Stack>
			</Stack>
		</AuthFormWidget>
	);
};
