import type {
	CreateNoteDto,
	NoteControllerFindAllParams,
	NoteControllerFindOneParams,
	NoteControllerFindSimilarParams,
	NoteControllerRemoveParams,
	NoteControllerUpdateParams,
	UpdateNoteDto,
} from '@shared/api';
import { z } from 'zod';

const noteIdParamsSchema = z.object({
	id: z.string().uuid(),
});

export const CreateNoteSchema = z.object({
	bodyMarkdown: z.string().min(1).max(32768),
	streamIds: z.array(z.string().uuid()).max(20).optional(),
}) satisfies z.ZodType<CreateNoteDto>;

export const UpdateNoteSchema = z.object({
	bodyMarkdown: z.string().min(1).max(32768),
}) satisfies z.ZodType<UpdateNoteDto>;

export const NoteFindAllParamsSchema = z.object({
	streamId: z.uuid().optional(),
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
}) satisfies z.ZodType<NoteControllerFindAllParams>;

export const NoteFindSimilarParamsSchema = z.object({
	query: z.string().min(1).max(500),
	limit: z.number().int().min(2).max(100).optional(),
}) satisfies z.ZodType<NoteControllerFindSimilarParams>;

export const NoteFindOneParamsSchema =
	noteIdParamsSchema satisfies z.ZodType<NoteControllerFindOneParams>;

export const NoteUpdateParamsSchema =
	noteIdParamsSchema satisfies z.ZodType<NoteControllerUpdateParams>;

export const NoteRemoveParamsSchema =
	noteIdParamsSchema satisfies z.ZodType<NoteControllerRemoveParams>;
