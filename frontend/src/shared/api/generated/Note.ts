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
  CreateNoteDto,
  NoteControllerCreateData,
  NoteControllerFindAllData,
  NoteControllerFindAllParams,
  NoteControllerFindOneData,
  NoteControllerFindOneParams,
  NoteControllerFindSimilarData,
  NoteControllerFindSimilarParams,
  NoteControllerRemoveData,
  NoteControllerRemoveParams,
  NoteControllerUpdateData,
  NoteControllerUpdateParams,
  UpdateNoteDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Note<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a note for the authorized user. Optional streamIds link existing user streams, optional streamNames create missing streams automatically and link them. The service stores full content in bodyMarkdown, stores markdown-stripped text in bodyText, uses the first 20 plain-text characters as previewText, and sets sourceType to WEB.
   *
   * @tags note
   * @name NoteControllerCreate
   * @summary create note
   * @request POST:/api/note
   * @secure
   * @response `201` `NoteControllerCreateData` Note was created
   * @response `400` `void` Validation errors
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream not found
   */
  noteControllerCreate = (data: CreateNoteDto, params: RequestParams = {}) =>
    this.http.request<NoteControllerCreateData, void>({
      path: `/api/note`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Returns authorized user note cards with linked stream ids and names ordered by createdAt desc. Optionally filters notes by linked streamId. Uses cursor pagination: pass page.nextCursor from the previous response as cursor to get the next page.
   *
   * @tags note
   * @name NoteControllerFindAll
   * @summary get notes
   * @request GET:/api/note
   * @secure
   * @response `200` `NoteControllerFindAllData` Paginated authorized user notes
   * @response `400` `void` Validation errors or invalid cursor
   * @response `401` `void` User is not authorized
   */
  noteControllerFindAll = (
    query: NoteControllerFindAllParams,
    params: RequestParams = {},
  ) =>
    this.http.request<NoteControllerFindAllData, void>({
      path: `/api/note`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns authorized user note cards ranked by content similarity to the query string. Ranking combines multilingual PostgreSQL full-text search and trigram word similarity.
   *
   * @tags note
   * @name NoteControllerFindSimilar
   * @summary find similar notes
   * @request GET:/api/note/similar
   * @secure
   * @response `200` `NoteControllerFindSimilarData` Closest authorized user notes
   * @response `400` `void` Validation errors
   * @response `401` `void` User is not authorized
   */
  noteControllerFindSimilar = (
    query: NoteControllerFindSimilarParams,
    params: RequestParams = {},
  ) =>
    this.http.request<NoteControllerFindSimilarData, void>({
      path: `/api/note/similar`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns one note by id.
   *
   * @tags note
   * @name NoteControllerFindOne
   * @summary get note by id
   * @request GET:/api/note/{id}
   * @secure
   * @response `200` `NoteControllerFindOneData` Note found
   * @response `401` `void` User is not authorized
   * @response `404` `void` Note not found
   */
  noteControllerFindOne = (
    { id }: NoteControllerFindOneParams,
    params: RequestParams = {},
  ) =>
    this.http.request<NoteControllerFindOneData, void>({
      path: `/api/note/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Updates note content. The service updates bodyMarkdown, bodyText, and previewText.
   *
   * @tags note
   * @name NoteControllerUpdate
   * @summary update note
   * @request PATCH:/api/note/{id}
   * @secure
   * @response `200` `NoteControllerUpdateData` Note was updated
   * @response `400` `void` Validation errors
   * @response `401` `void` User is not authorized
   * @response `404` `void` Note not found
   */
  noteControllerUpdate = (
    { id }: NoteControllerUpdateParams,
    data: UpdateNoteDto,
    params: RequestParams = {},
  ) =>
    this.http.request<NoteControllerUpdateData, void>({
      path: `/api/note/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Deletes a note.
   *
   * @tags note
   * @name NoteControllerRemove
   * @summary delete note
   * @request DELETE:/api/note/{id}
   * @secure
   * @response `200` `NoteControllerRemoveData` Note was deleted
   * @response `401` `void` User is not authorized
   * @response `404` `void` Note not found
   */
  noteControllerRemove = (
    { id }: NoteControllerRemoveParams,
    params: RequestParams = {},
  ) =>
    this.http.request<NoteControllerRemoveData, void>({
      path: `/api/note/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
}
