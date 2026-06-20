import { routeConfig } from '@shared/model/route.config';
import {
	createRoute,
	lazyRouteComponent,
	type AnyRoute,
} from '@tanstack/react-router';

export const createStreamRoute = <TParentRoute extends AnyRoute>(
	parentRoute: TParentRoute,
) =>
	createRoute({
		getParentRoute: () => parentRoute,
		path: routeConfig.stream,
		component: lazyRouteComponent(() => import('./ui/stream.page')),
	});
