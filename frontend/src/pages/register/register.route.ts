import { routeConfig } from '@shared/model/route.config';
import {
	createRoute,
	lazyRouteComponent,
	type AnyRoute,
} from '@tanstack/react-router';

export const createRegisterRoute = <TParentRoute extends AnyRoute>(
	parentRoute: TParentRoute,
) =>
	createRoute({
		getParentRoute: () => parentRoute,
		path: routeConfig.register,
		component: lazyRouteComponent(() => import('./register.page')),
	});
