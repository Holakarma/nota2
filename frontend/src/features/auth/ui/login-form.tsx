import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField } from '@mui/material';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSignInMutation } from '../api';
import { getSignInErrorMessage } from '../model/auth-error';
import { SignInSchema, type TypeSignInSchema } from '../model/schemes';
import { AuthFormWidget } from './auth-form.widget';

export const LoginForm = () => {
	const navigate = useNavigate();
	const [isServerErrorOpen, setIsServerErrorOpen] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TypeSignInSchema>({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: zodResolver(SignInSchema),
	});

	const signInMutation = useSignInMutation({
		onSuccess: () => {
			void navigate({
				to: routeConfig.chat,
				params: { streamId: DEFAULT_STREAM_ROUTE_PARAM },
				replace: true,
			});
		},
	});

	const isPending = signInMutation.isPending;
	const serverError = getSignInErrorMessage(signInMutation.error);

	useEffect(() => {
		if (serverError) {
			setIsServerErrorOpen(true);
		}
	}, [serverError]);

	const submitForm = (values: TypeSignInSchema) => {
		signInMutation.mutate(values);
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
					autoComplete="current-password"
					placeholder="Пароль"
					aria-label="Пароль"
					aria-invalid={Boolean(errors.password)}
					aria-describedby={
						errors.password ? 'password-error' : undefined
					}
				/>

				<Stack spacing={1}>
					<Button
						fullWidth
						variant="contained"
						type="submit"
						loading={isPending}
					>
						Войти
					</Button>

					<Stack
						spacing={1}
						direction="row"
					>
						<Button
							component={Link}
							to="/register"
							variant="outlined"
							disabled={isPending}
							sx={{
								flexGrow: 1,
							}}
						>
							Создать аккаунт
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</AuthFormWidget>
	);
};
