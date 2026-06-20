export const DEFAULT_STREAM_ROUTE_PARAM = 'default';

export const routeConfig = {
	stream: '/stream/{-$streamId}/',
	streamNote: '/stream/$streamId/note/$noteId',
	register: '/register',
	profile: '/profile',
	note: '/note/{-$noteId}',
	login: '/login',
	chat: '/chat/{-$streamId}/',
	chatNote: '/chat/$streamId/note/$noteId',
} as const;
