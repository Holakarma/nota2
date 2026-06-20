import {
	Outlet,
	createRoute,
	redirect,
	type AnyRoute,
	type AnyRootRoute,
} from '@tanstack/react-router';
import { Layout } from '@app/layout/app-layout';
import { refreshAccessToken } from '@shared/api/auth-session';
import { getAccessToken } from '@shared/auth';
import { Stack, Typography } from '@mui/material';
import {
	DEFAULT_STREAM_ROUTE_PARAM,
	routeConfig,
} from '@shared/model/route.config';

export const createProtectedRoute = <TRootRoute extends AnyRootRoute>(
	rootRoute: TRootRoute,
) =>
	createRoute({
		getParentRoute: () => rootRoute,
		id: 'protected',
		component: Layout,
		beforeLoad: async () => {
			if (getAccessToken()) {
				return;
			}

			try {
				await refreshAccessToken();
			} catch {
				throw redirect({
					to: '/login',
					replace: true,
				});
			}
		},
	});

export const createPublicOnlyRoute = <TRootRoute extends AnyRootRoute>(
	rootRoute: TRootRoute,
) =>
	createRoute({
		getParentRoute: () => rootRoute,
		id: 'public-only',
		component: () => <Outlet />,
		beforeLoad: async () => {
			if (getAccessToken()) {
				throw redirect({
					to: routeConfig.chat,
					params: { streamId: DEFAULT_STREAM_ROUTE_PARAM },
					replace: true,
				});
			}

			try {
				await refreshAccessToken();
			} catch {
				return;
			}

			throw redirect({
				to: routeConfig.chat,
				params: { streamId: DEFAULT_STREAM_ROUTE_PARAM },
				replace: true,
			});
		},
	});

export const createProtectedNotFoundRoute = <TParentRoute extends AnyRoute>(
	parentRoute: TParentRoute,
) =>
	createRoute({
		getParentRoute: () => parentRoute,
		path: '{$}',
		component: () => (
			<Stack
				spacing={2}
				sx={{
					height: '100vh',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography variant="R48">404</Typography>
				<Typography variant="M40">Страница не найдена</Typography>
			</Stack>
		),
	});
