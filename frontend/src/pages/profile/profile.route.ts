import { routeConfig } from '@shared/model/route.config';
import {
	createRoute,
	lazyRouteComponent,
	type AnyRoute,
} from '@tanstack/react-router';

export const createProfileRoute = <TParentRoute extends AnyRoute>(
	parentRoute: TParentRoute,
) =>
	createRoute({
		getParentRoute: () => parentRoute,
		path: routeConfig.profile,
		component: lazyRouteComponent(() => import('./profile.page')),
	});
