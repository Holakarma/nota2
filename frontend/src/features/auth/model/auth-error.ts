import { isAxiosError } from 'axios';

const getResponseMessage = (data: unknown) => {
	if (typeof data !== 'object' || data === null) {
		return null;
	}

	const message = (data as { message?: unknown }).message;

	if (Array.isArray(message)) {
		return message.filter((item) => typeof item === 'string').join('. ');
	}

	if (typeof message === 'string') {
		return message;
	}

	return null;
};

const getFallbackAuthErrorMessage = (
	error: unknown,
	statusMessages: Record<number, string>,
	fallbackMessage: string,
) => {
	if (!error) {
		return null;
	}

	if (!isAxiosError(error)) {
		return fallbackMessage;
	}

	if (!error.response) {
		return 'Не удалось подключиться к серверу. Проверьте соединение и попробуйте еще раз.';
	}

	const statusMessage = statusMessages[error.response.status];

	if (statusMessage) {
		return statusMessage;
	}

	return getResponseMessage(error.response.data) ?? fallbackMessage;
};

export const getSignInErrorMessage = (error: unknown) =>
	getFallbackAuthErrorMessage(
		error,
		{
			400: 'Проверьте логин и пароль.',
			404: 'Пользователь с таким логином не найден.',
		},
		'Не удалось войти в аккаунт. Попробуйте еще раз.',
	);

export const getSignUpErrorMessage = (error: unknown) =>
	getFallbackAuthErrorMessage(
		error,
		{
			400: 'Проверьте данные регистрации.',
			409: 'Пользователь с таким логином уже существует.',
		},
		'Не удалось зарегистрировать аккаунт. Попробуйте еще раз.',
	);
