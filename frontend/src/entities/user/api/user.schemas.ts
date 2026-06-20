import { z } from 'zod';

export const CurrentUserSchema = z.object({
	login: z.string(),
	id: z.uuid(),
	passwordHash: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type CurrentUser = z.infer<typeof CurrentUserSchema>;
