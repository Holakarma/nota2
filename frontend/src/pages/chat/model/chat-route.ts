import { isDefaultStream } from '@entities/stream';

const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const CHAT_MESSAGES_PAGE_LIMIT = 10;
export const STREAM_NOTES_PREVIEW_LIMIT = 20;

export const isUuid = (value?: string) =>
	Boolean(value && UUID_PATTERN.test(value));


export const getValidChatStreamId = (value?: string) => {
	if (isDefaultStream(value)) {
		return undefined;
	}

	return isUuid(value) ? value : undefined;
};
