import type {
	CreateStreamDto,
	NoteStreamControllerAttachNoteParams,
	NoteStreamControllerDetachNoteParams,
	NoteStreamControllerFindNotesParams,
	StreamControllerFindAllParams,
	StreamControllerFindOneParams,
	StreamControllerFindSimilarParams,
	StreamControllerRemoveParams,
	StreamControllerUpdateParams,
	UpdateStreamDto,
} from '@shared/api';
import { z } from 'zod';

const streamIdParamsSchema = z.object({
	id: z.string().uuid(),
});

const streamNameSchema = z.object({
	name: z.string().min(1).max(128),
});

const streamNoteParamsSchema = z.object({
	streamId: z.uuid(),
	noteId: z.uuid(),
});

export const CreateStreamSchema =
	streamNameSchema satisfies z.ZodType<CreateStreamDto>;

export const UpdateStreamSchema =
	streamNameSchema satisfies z.ZodType<UpdateStreamDto>;

export const StreamFindAllParamsSchema = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
}) satisfies z.ZodType<StreamControllerFindAllParams>;

export const StreamFindSimilarParamsSchema = z.object({
	query: z.string().min(1).max(500),
	limit: z.number().int().min(2).max(100).optional(),
}) satisfies z.ZodType<StreamControllerFindSimilarParams>;

export const StreamFindOneParamsSchema =
	streamIdParamsSchema satisfies z.ZodType<StreamControllerFindOneParams>;

export const StreamUpdateParamsSchema =
	streamIdParamsSchema satisfies z.ZodType<StreamControllerUpdateParams>;

export const StreamRemoveParamsSchema =
	streamIdParamsSchema satisfies z.ZodType<StreamControllerRemoveParams>;

export const StreamFindNotesParamsSchema = z.object({
	streamId: z.uuid(),
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(100).optional(),
}) satisfies z.ZodType<NoteStreamControllerFindNotesParams>;

export const AttachNoteToStreamParamsSchema =
	streamNoteParamsSchema satisfies z.ZodType<NoteStreamControllerAttachNoteParams>;

export const DetachNoteFromStreamParamsSchema =
	streamNoteParamsSchema satisfies z.ZodType<NoteStreamControllerDetachNoteParams>;
