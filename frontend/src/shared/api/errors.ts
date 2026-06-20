import { isAxiosError } from "axios";

export const isConflictError = (error: unknown) =>
    isAxiosError(error) && error.response?.status === 409;