import type { ChatMessageResponseDto } from '@shared/api';

export const getChatMessageNoteId = (message: ChatMessageResponseDto) => {
	return message.result?.note?.id;
};

export const getChatMessageDateKey = (date: string) =>
	new Date(date).toISOString().slice(0, 10);

export const formatChatMessageDate = (date: string) =>
	new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
	}).format(new Date(date));
