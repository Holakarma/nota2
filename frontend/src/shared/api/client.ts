import {
	AxiosHeaders,
	type AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from 'axios';
import { getAccessToken, setAccessToken } from '@shared/auth';
import {
	API_BASE_URL,
	REFRESH_PATH,
	refreshAccessToken,
} from './auth-session';
import type { AuthResponse } from './generated/data-contracts';
import { Auth } from './generated/Auth';
import { Chat } from './generated/Chat';
import { HttpClient } from './generated/http-client';
import { Note } from './generated/Note';
import { Stream } from './generated/Stream';

type RetryableRequestConfig = AxiosRequestConfig & {
	_retry?: boolean;
};

export const apiHttpClient = new HttpClient({
	baseURL: API_BASE_URL,
	withCredentials: true,
	securityWorker: () => {
		const token = getAccessToken();

		if (!token) {
			return;
		}

		return {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
	},
});

const isAuthResponse = (data: unknown): data is AuthResponse =>
	typeof data === 'object' &&
	data !== null &&
	'accessToken' in data &&
	typeof data.accessToken === 'string';

const persistAccessTokenFromResponse = (response: AxiosResponse) => {
	if (isAuthResponse(response.data)) {
		setAccessToken(response.data.accessToken);
	}
};

const setAuthorizationHeader = (
	config: AxiosRequestConfig,
	accessToken: string,
) => {
	const headers = AxiosHeaders.from(config.headers as Record<string, string>);
	headers.set('Authorization', `Bearer ${accessToken}`);
	config.headers = headers;
};

const isRefreshRequest = (url?: string) => {
	if (!url) {
		return false;
	}

	return url === REFRESH_PATH || url.endsWith(REFRESH_PATH);
};

const shouldTryRefresh = (error: AxiosError) => {
	const originalRequest = error.config as RetryableRequestConfig | undefined;

	return (
		error.response?.status === 401 &&
		Boolean(originalRequest) &&
		!originalRequest?._retry &&
		!isRefreshRequest(originalRequest?.url)
	);
};

apiHttpClient.instance.interceptors.response.use(
	(response) => {
		persistAccessTokenFromResponse(response);

		return response;
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as RetryableRequestConfig | undefined;

		if (!shouldTryRefresh(error) || !originalRequest) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		try {
			const token = await refreshAccessToken();
			setAuthorizationHeader(originalRequest, token);

			return apiHttpClient.instance(originalRequest);
		} catch (refreshError) {
			return Promise.reject(refreshError);
		}
	},
);

export const authApi = new Auth(apiHttpClient);
export const chatApi = new Chat(apiHttpClient);
export const noteApi = new Note(apiHttpClient);
export const streamApi = new Stream(apiHttpClient);

export const api = {
	auth: authApi,
	chat: chatApi,
	note: noteApi,
	stream: streamApi,
} as const;
