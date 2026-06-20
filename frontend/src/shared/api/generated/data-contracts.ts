/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type ChatMessageRole = "USER" | "SYSTEM";

export type NoteSourceType = "WEB" | "TELEGRAM";

export interface SignUpRequestDto {
  /**
   * User login
   * @minLength 8
   * @maxLength 255
   * @example "user-login"
   */
  login: string;
  /**
   * User password
   * @minLength 8
   * @maxLength 128
   * @example "strong-password"
   */
  password: string;
}

export interface AuthResponse {
  /**
   * JWT access token
   * @example "etrf7AG7iFA78FAdsfaF..."
   */
  accessToken: string;
}

export interface SignInRequestDto {
  /**
   * User login
   * @minLength 8
   * @maxLength 255
   * @example "user-login"
   */
  login: string;
  /**
   * User password
   * @minLength 8
   * @maxLength 128
   * @example "strong-password"
   */
  password: string;
}

export interface StreamResponseDto {
  /**
   * @format uuid
   * @example "1a6b43f3-d064-4e83-a9ec-fba73453a49c"
   */
  id: string;
  /**
   * @format uuid
   * @example "cecb38fb-dc6b-4b5f-9cf7-e733dbadbe7e"
   */
  userId: string;
  /** @example "work" */
  name: string;
  /** @example "work" */
  normalizedName: string;
  /**
   * @format date-time
   * @example "2026-04-29T10:00:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2026-04-29T10:00:00.000Z"
   */
  updatedAt: string;
}

export interface FindSimilarStreamsDto {
  /**
   * Text used to find the closest streams by name
   * @minLength 1
   * @maxLength 500
   * @example "work projects"
   */
  query: string;
  /**
   * Maximum number of similar streams to return
   * @min 2
   * @max 100
   * @default 5
   * @example 5
   */
  limit?: object;
}

export interface CreateStreamDto {
  /**
   * stream name
   * @minLength 1
   * @maxLength 128
   * @example "work"
   */
  name: string;
}

export interface UpdateStreamDto {
  /**
   * stream new name
   * @minLength 1
   * @maxLength 128
   * @example "personal"
   */
  name: string;
}

export interface NoteListStreamResponseDto {
  /**
   * @format uuid
   * @example "1a6b43f3-d064-4e83-a9ec-fba73453a49c"
   */
  id: string;
  /** @example "work" */
  name: string;
}

export interface NoteWithStreamsResponseDto {
  /**
   * @format uuid
   * @example "8e2d5c9a-2b19-4d2f-9a4e-7d1c2f6a9b10"
   */
  id: string;
  /** @example "new note" */
  previewText: string;
  /** streams linked with this note */
  streams: NoteListStreamResponseDto[];
  /**
   * @format date-time
   * @example "2026-04-29T10:00:00.000Z"
   */
  updatedAt: string;
  /**
   * @format date-time
   * @example "2026-04-29T10:00:00.000Z"
   */
  createdAt: string;
}

export interface NoteResponseDto {
  /**
   * @format uuid
   * @example "8e2d5c9a-2b19-4d2f-9a4e-7d1c2f6a9b10"
   */
  id: string;
  /**
   * @format uuid
   * @example "cecb38fb-dc6b-4b5f-9cf7-e733dbadbe7e"
   */
  userId: string;
  /** @example "new note" */
  bodyMarkdown: string;
  /** @example "new note" */
  bodyText: string;
  /** @example "new note" */
  previewText: string;
  /** streams linked with this note */
  streams: NoteListStreamResponseDto[];
  /** @example "WEB" */
  sourceType: NoteSourceType;
  /** @example {} */
  sourceMeta: Record<string, any>;
  /**
   * @format date-time
   * @example "2026-04-29T10:00:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2026-04-29T10:00:00.000Z"
   */
  updatedAt: string;
  /**
   * @format date-time
   * @example null
   */
  deletedAt?: object | null;
  /**
   * @format uuid
   * @example "5e6ab56f-205c-4fd1-9d6b-bdddfb816c39"
   */
  sourceMessageId?: object | null;
}

export interface FindSimilarNotesDto {
  /**
   * Text used to find the closest notes by content
   * @minLength 1
   * @maxLength 500
   * @example "meeting notes about project deadlines"
   */
  query: string;
  /**
   * Maximum number of similar notes to return
   * @min 2
   * @max 100
   * @default 5
   * @example 5
   */
  limit?: object;
}

export interface CreateNoteDto {
  /**
   * note content
   * @minLength 1
   * @maxLength 32768
   * @example "new note"
   */
  bodyMarkdown: string;
  /**
   * existing stream ids to link with this note
   * @maxItems 20
   * @example ["1a6b43f3-d064-4e83-a9ec-fba73453a49c"]
   */
  streamIds?: string[];
}

export interface UpdateNoteDto {
  /**
   * note new content
   * @minLength 1
   * @maxLength 32768
   * @example "note new content"
   */
  bodyMarkdown: string;
}

export interface ChatResponseDto {
  /**
   * @format uuid
   * @example "2d203a13-3e78-4fcb-a31d-6dcbdf9ec88e"
   */
  id: string;
  /**
   * @format uuid
   * @example "cecb38fb-dc6b-4b5f-9cf7-e733dbadbe7e"
   */
  userId: string;
  /**
   * @format uuid
   * @example "1a6b43f3-d064-4e83-a9ec-fba73453a49c"
   */
  streamId?: object | null;
  /**
   * @format date-time
   * @example "2026-05-03T10:00:00.000Z"
   */
  createdAt: string;
  /**
   * @format date-time
   * @example "2026-05-03T10:00:00.000Z"
   */
  updatedAt: string;
}

export interface ChatMessageResultNoteResponseDto {
  /**
   * @format uuid
   * @example "8e2d5c9a-2b19-4d2f-9a4e-7d1c2f6a9b10"
   */
  id: string;
  /**
   * markdown-stripped preview text of the created note
   * @example "Need to follow up with Alex tomorrow"
   */
  previewText: string;
  /**
   * names of all streams linked to the created note
   * @example ["work"]
   */
  streamNames: string[];
}

export interface ChatMessageStreamResponseDto {
  /**
   * @format uuid
   * @example "1a6b43f3-d064-4e83-a9ec-fba73453a49c"
   */
  id: string;
  /** @example "work" */
  name: string;
}

export interface ChatMessageResultResponseDto {
  /** note created from this message */
  note: ChatMessageResultNoteResponseDto | null;
  /** streams newly created while processing this message */
  streams: ChatMessageStreamResponseDto[];
}

export interface ChatMessageResponseDto {
  /**
   * @format uuid
   * @example "5e6ab56f-205c-4fd1-9d6b-bdddfb816c39"
   */
  id: string;
  /**
   * @format uuid
   * @example "2d203a13-3e78-4fcb-a31d-6dcbdf9ec88e"
   */
  chatId: string;
  /** @example "USER" */
  role: ChatMessageRole;
  /**
   * original user message markdown
   * @example ":work
   * Need to follow up with Alex tomorrow"
   */
  bodyMarkdown: string;
  /**
   * @format uuid
   * @example null
   */
  replyToMessageId?: object | null;
  /** message processing result */
  result: ChatMessageResultResponseDto | null;
  /**
   * @format date-time
   * @example "2026-05-03T10:00:00.000Z"
   */
  createdAt: string;
}

export interface CreateChatDto {
  /**
   * existing stream id to bind this chat to
   * @format uuid
   * @example "1a6b43f3-d064-4e83-a9ec-fba73453a49c"
   */
  streamId?: string;
}

export interface CreateChatMessageDto {
  /**
   * Full user message markdown. Non-blank leading and trailing lines that start with ":" are parsed as stream names and excluded from the created note body.
   * @minLength 1
   * @maxLength 32768
   * @example ":work
   * Need to follow up with Alex tomorrow"
   */
  bodyMarkdown: string;
}

export type AuthControllerSignUpData = AuthResponse;

export type AuthControllerSignInData = AuthResponse;

export type AuthControllerRefreshData = AuthResponse;

export type AuthControllerLogoutData = any;

export type StreamControllerCreateData = StreamResponseDto;

export interface StreamControllerFindAllParams {
  /** Cursor from page.nextCursor. The cursor is a base64url-encoded JSON string with a stream id. */
  cursor?: string;
  /**
   * Maximum number of items to return.
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
}

export interface StreamControllerFindAllData {
  result: StreamResponseDto[];
  page: {
    /** @example true */
    hasNextPage: boolean;
    /** @example "IjFhNmI0M2YzLWQwNjQtNGU4My1hOWVjLWZiYTczNDUzYTQ5YyI" */
    nextCursor: string | null;
  };
}

export interface StreamControllerFindSimilarParams {
  /**
   * Text used to find the closest streams by name.
   * @minLength 1
   * @maxLength 500
   */
  query: string;
  /**
   * Maximum number of similar streams to return.
   * @min 2
   * @max 100
   * @default 5
   */
  limit?: number;
}

export type StreamControllerFindSimilarData = StreamResponseDto[];

export interface StreamControllerFindOneParams {
  /**
   * Stream id
   * @format uuid
   */
  id: string;
}

export type StreamControllerFindOneData = StreamResponseDto;

export interface StreamControllerUpdateParams {
  /**
   * Stream id
   * @format uuid
   */
  id: string;
}

export type StreamControllerUpdateData = StreamResponseDto;

export interface StreamControllerRemoveParams {
  /**
   * Stream id
   * @format uuid
   */
  id: string;
}

/** @example true */
export type StreamControllerRemoveData = boolean;

export interface NoteStreamControllerFindNotesParams {
  /** Cursor from page.nextCursor. The cursor is a base64url-encoded JSON string with a note id. */
  cursor?: string;
  /**
   * Maximum number of items to return.
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * Stream id
   * @format uuid
   */
  streamId: string;
}

export interface NoteStreamControllerFindNotesData {
  result: NoteWithStreamsResponseDto[];
  page: {
    /** @example true */
    hasNextPage: boolean;
    /** @example "IjhlMmQ1YzlhLTJiMTktNGQyZi05YTRlLTdkMWMyZjZhOWIxMCI" */
    nextCursor: string | null;
  };
}

export interface NoteStreamControllerAttachNoteParams {
  /**
   * Stream id
   * @format uuid
   */
  streamId: string;
  /**
   * Note id
   * @format uuid
   */
  noteId: string;
}

/** @example true */
export type NoteStreamControllerAttachNoteData = boolean;

export interface NoteStreamControllerDetachNoteParams {
  /**
   * Stream id
   * @format uuid
   */
  streamId: string;
  /**
   * Note id
   * @format uuid
   */
  noteId: string;
}

/** @example true */
export type NoteStreamControllerDetachNoteData = boolean;

/** @example true */
export type NoteControllerCreateData = boolean;

export interface NoteControllerFindAllParams {
  /**
   * Return only notes linked with this stream id.
   * @format uuid
   * @example "1a6b43f3-d064-4e83-a9ec-fba73453a49c"
   */
  streamId?: string;
  /** Cursor from page.nextCursor. The cursor is a base64url-encoded JSON string with a note id. */
  cursor?: string;
  /**
   * Maximum number of notes to return.
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
}

export interface NoteControllerFindAllData {
  result: NoteWithStreamsResponseDto[];
  page: {
    /** @example true */
    hasNextPage: boolean;
    /** @example "IjhlMmQ1YzlhLTJiMTktNGQyZi05YTRlLTdkMWMyZjZhOWIxMCI" */
    nextCursor: string | null;
  };
}

export interface NoteControllerFindSimilarParams {
  /**
   * Text used to find the closest notes by content.
   * @minLength 1
   * @maxLength 500
   */
  query: string;
  /**
   * Maximum number of similar notes to return.
   * @min 2
   * @max 100
   * @default 5
   */
  limit?: number;
}

export type NoteControllerFindSimilarData = NoteWithStreamsResponseDto[];

export interface NoteControllerFindOneParams {
  /**
   * Note id
   * @format uuid
   */
  id: string;
}

export type NoteControllerFindOneData = NoteResponseDto;

export interface NoteControllerUpdateParams {
  /**
   * Note id
   * @format uuid
   */
  id: string;
}

export type NoteControllerUpdateData = NoteResponseDto;

export interface NoteControllerRemoveParams {
  /**
   * Note id
   * @format uuid
   */
  id: string;
}

/** @example true */
export type NoteControllerRemoveData = boolean;

export type ChatControllerCreateData = ChatResponseDto;

export type ChatControllerEnsureData = ChatResponseDto;

export interface ChatControllerFindAllParams {
  /** Cursor from page.nextCursor. The cursor is a base64url-encoded JSON string with a chat id. */
  cursor?: string;
  /**
   * Maximum number of items to return.
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
}

export interface ChatControllerFindAllData {
  result: ChatResponseDto[];
  page: {
    /** @example true */
    hasNextPage: boolean;
    /** @example "IjJkMjAzYTEzLTNlNzgtNGZjYi1hMzFkLTZkY2JkZjllYzg4ZSI" */
    nextCursor: string | null;
  };
}

export interface ChatControllerFindMessagesParams {
  /** Cursor from page.nextCursor. The cursor is a base64url-encoded JSON string with a chat message id. */
  cursor?: string;
  /**
   * Maximum number of items to return.
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * Chat id
   * @format uuid
   */
  chatId: string;
}

export interface ChatControllerFindMessagesData {
  result: ChatMessageResponseDto[];
  page: {
    /** @example true */
    hasNextPage: boolean;
    /** @example "IjVlNmFiNTZmLTIwNWMtNGZkMS05ZDZiLWJkZGRmYjgxNmMzOSI" */
    nextCursor: string | null;
  };
}

export interface ChatControllerCreateMessageParams {
  /**
   * Chat id
   * @format uuid
   */
  chatId: string;
}

export type ChatControllerCreateMessageData = ChatMessageResponseDto;
