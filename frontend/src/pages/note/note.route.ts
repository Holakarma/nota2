import { routeConfig } from '@shared/model/route.config';
import {
	createRoute,
	lazyRouteComponent,
	type AnyRoute,
} from '@tanstack/react-router';

export const createNoteRoute = <TParentRoute extends AnyRoute>(
	parentRoute: TParentRoute,
) =>
	createRoute({
		getParentRoute: () => parentRoute,
		path: routeConfig.note,
		component: lazyRouteComponent(() => import('./note.page')),
	});

export const createStreamNoteRoute = <TParentRoute extends AnyRoute>(
	parentRoute: TParentRoute,
) =>
	createRoute({
		getParentRoute: () => parentRoute,
		path: routeConfig.streamNote,
		component: lazyRouteComponent(() => import('./note.page'), 'StreamNotePage'),
	});

export const createChatNoteRoute = <TParentRoute extends AnyRoute>(
	parentRoute: TParentRoute,
) =>
	createRoute({
		getParentRoute: () => parentRoute,
		path: routeConfig.chatNote,
		component: lazyRouteComponent(() => import('./note.page'), 'ChatNotePage'),
	});
