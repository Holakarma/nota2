import type {
	ChatControllerCreateMessageParams,
	ChatControllerFindAllParams,
	ChatControllerFindMessagesParams,
	CreateChatDto,
	CreateChatMessageDto,
} from '@shared/api';
import { z } from 'zod';

const paginationSchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

export const CreateChatSchema = z.object({
	streamId: z.uuid().optional(),
}) satisfies z.ZodType<CreateChatDto>;

export const ChatFindAllParamsSchema =
	paginationSchema satisfies z.ZodType<ChatControllerFindAllParams>;

export const ChatFindMessagesParamsSchema = paginationSchema.extend({
	chatId: z.uuid(),
}) satisfies z.ZodType<ChatControllerFindMessagesParams>;

export const ChatCreateMessageParamsSchema = z.object({
	chatId: z.uuid(),
}) satisfies z.ZodType<ChatControllerCreateMessageParams>;

export const CreateChatMessageSchema = z.object({
	bodyMarkdown: z.string().min(1).max(32768),
}) satisfies z.ZodType<CreateChatMessageDto>;
