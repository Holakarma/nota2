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

import {
  ChatControllerCreateData,
  ChatControllerCreateMessageData,
  ChatControllerCreateMessageParams,
  ChatControllerEnsureData,
  ChatControllerFindAllData,
  ChatControllerFindAllParams,
  ChatControllerFindMessagesData,
  ChatControllerFindMessagesParams,
  CreateChatDto,
  CreateChatMessageDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Chat<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a chat for the authorized user and optional streamId. Optional streamId must belong to the user. Returns conflict if this chat already exists.
   *
   * @tags chat
   * @name ChatControllerCreate
   * @summary create chat
   * @request POST:/api/chat
   * @secure
   * @response `201` `ChatControllerCreateData` Chat was created
   * @response `400` `void` Validation errors
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream not found
   * @response `409` `void` Chat already exists
   */
  chatControllerCreate = (data: CreateChatDto, params: RequestParams = {}) =>
    this.http.request<ChatControllerCreateData, void>({
      path: `/api/chat`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Creates or returns the single chat for the authorized user and optional streamId. Optional streamId must belong to the user.
   *
   * @tags chat
   * @name ChatControllerEnsure
   * @summary ensure chat
   * @request PUT:/api/chat
   * @secure
   * @response `200` `ChatControllerEnsureData` Existing or newly created chat
   * @response `400` `void` Validation errors
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream not found
   */
  chatControllerEnsure = (data: CreateChatDto, params: RequestParams = {}) =>
    this.http.request<ChatControllerEnsureData, void>({
      path: `/api/chat`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Returns authorized user chats ordered by updatedAt desc. Uses cursor pagination.
   *
   * @tags chat
   * @name ChatControllerFindAll
   * @summary get chats
   * @request GET:/api/chat
   * @secure
   * @response `200` `ChatControllerFindAllData` Paginated authorized user chats
   * @response `400` `void` Validation errors or invalid cursor
   * @response `401` `void` User is not authorized
   */
  chatControllerFindAll = (
    query: ChatControllerFindAllParams,
    params: RequestParams = {},
  ) =>
    this.http.request<ChatControllerFindAllData, void>({
      path: `/api/chat`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns messages of one authorized user chat ordered by createdAt desc.
   *
   * @tags chat
   * @name ChatControllerFindMessages
   * @summary get chat messages
   * @request GET:/api/chat/{chatId}/messages
   * @secure
   * @response `200` `ChatControllerFindMessagesData` Paginated chat messages
   * @response `400` `void` Validation errors or invalid cursor
   * @response `401` `void` User is not authorized
   * @response `404` `void` Chat not found
   */
  chatControllerFindMessages = (
    { chatId, ...query }: ChatControllerFindMessagesParams,
    params: RequestParams = {},
  ) =>
    this.http.request<ChatControllerFindMessagesData, void>({
      path: `/api/chat/${chatId}/messages`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Creates one user message with the original bodyMarkdown, parses leading and trailing lines that start with ":" as stream names, creates one note from the remaining markdown, links the note with the chat stream and parsed streams, and stores only newly created streams in the message result.
   *
   * @tags chat
   * @name ChatControllerCreateMessage
   * @summary send chat message
   * @request POST:/api/chat/{chatId}/messages
   * @secure
   * @response `201` `ChatControllerCreateMessageData` Chat message was processed
   * @response `400` `void` Validation errors or empty note body after stream service lines
   * @response `401` `void` User is not authorized
   * @response `404` `void` Chat not found
   */
  chatControllerCreateMessage = (
    { chatId }: ChatControllerCreateMessageParams,
    data: CreateChatMessageDto,
    params: RequestParams = {},
  ) =>
    this.http.request<ChatControllerCreateMessageData, void>({
      path: `/api/chat/${chatId}/messages`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
