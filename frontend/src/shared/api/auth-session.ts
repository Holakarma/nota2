import axios from 'axios';
import { clearAccessToken, setAccessToken } from '@shared/auth';

type AuthResponse = {
	accessToken: string;
};

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const REFRESH_PATH =
	import.meta.env.VITE_API_REFRESH_PATH ?? '/api/auth/refresh';

const refreshClient = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
});

let refreshRequest: Promise<string> | null = null;

export const refreshAccessToken = async () => {
	if (!refreshRequest) {
		refreshRequest = refreshClient
			.post<AuthResponse>(REFRESH_PATH)
			.then((response) => {
				setAccessToken(response.data.accessToken);

				return response.data.accessToken;
			})
			.catch((error: unknown) => {
				clearAccessToken();

				throw error;
			})
			.finally(() => {
				refreshRequest = null;
			});
	}

	return refreshRequest;
};
