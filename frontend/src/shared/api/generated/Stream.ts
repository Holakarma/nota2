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
  CreateStreamDto,
  NoteStreamControllerAttachNoteData,
  NoteStreamControllerAttachNoteParams,
  NoteStreamControllerDetachNoteData,
  NoteStreamControllerDetachNoteParams,
  NoteStreamControllerFindNotesData,
  NoteStreamControllerFindNotesParams,
  StreamControllerCreateData,
  StreamControllerFindAllData,
  StreamControllerFindAllParams,
  StreamControllerFindOneData,
  StreamControllerFindOneParams,
  StreamControllerFindSimilarData,
  StreamControllerFindSimilarParams,
  StreamControllerRemoveData,
  StreamControllerRemoveParams,
  StreamControllerUpdateData,
  StreamControllerUpdateParams,
  UpdateStreamDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Stream<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description Creates a stream for the authorized user. Stream names are unique per user after normalization.
   *
   * @tags stream
   * @name StreamControllerCreate
   * @summary create stream
   * @request POST:/api/stream
   * @secure
   * @response `201` `StreamControllerCreateData` Stream was created
   * @response `400` `void` Validation errors
   * @response `401` `void` User is not authorized
   * @response `409` `void` Stream with this name already exists
   */
  streamControllerCreate = (
    data: CreateStreamDto,
    params: RequestParams = {},
  ) =>
    this.http.request<StreamControllerCreateData, void>({
      path: `/api/stream`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Returns authorized user streams ordered by name.
   *
   * @tags stream
   * @name StreamControllerFindAll
   * @summary get streams
   * @request GET:/api/stream
   * @secure
   * @response `200` `StreamControllerFindAllData` Paginated authorized user streams
   * @response `400` `void` Validation errors or invalid cursor
   * @response `401` `void` User is not authorized
   */
  streamControllerFindAll = (
    query: StreamControllerFindAllParams,
    params: RequestParams = {},
  ) =>
    this.http.request<StreamControllerFindAllData, void>({
      path: `/api/stream`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns authorized user streams ranked by name similarity to the query string. Ranking combines multilingual PostgreSQL full-text search and trigram word similarity.
   *
   * @tags stream
   * @name StreamControllerFindSimilar
   * @summary find similar streams
   * @request GET:/api/stream/similar
   * @secure
   * @response `200` `StreamControllerFindSimilarData` Closest authorized user streams
   * @response `400` `void` Validation errors
   * @response `401` `void` User is not authorized
   */
  streamControllerFindSimilar = (
    query: StreamControllerFindSimilarParams,
    params: RequestParams = {},
  ) =>
    this.http.request<StreamControllerFindSimilarData, void>({
      path: `/api/stream/similar`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns one stream by id.
   *
   * @tags stream
   * @name StreamControllerFindOne
   * @summary get stream by id
   * @request GET:/api/stream/{id}
   * @secure
   * @response `200` `StreamControllerFindOneData` Stream found
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream not found
   */
  streamControllerFindOne = (
    { id }: StreamControllerFindOneParams,
    params: RequestParams = {},
  ) =>
    this.http.request<StreamControllerFindOneData, void>({
      path: `/api/stream/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Updates stream name.
   *
   * @tags stream
   * @name StreamControllerUpdate
   * @summary update stream
   * @request PATCH:/api/stream/{id}
   * @secure
   * @response `200` `StreamControllerUpdateData` Stream was updated
   * @response `400` `void` Validation errors
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream not found
   * @response `409` `void` Stream with this name already exists
   */
  streamControllerUpdate = (
    { id }: StreamControllerUpdateParams,
    data: UpdateStreamDto,
    params: RequestParams = {},
  ) =>
    this.http.request<StreamControllerUpdateData, void>({
      path: `/api/stream/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description Deletes a stream owned by the user. Notes are not deleted; only note-stream links are removed by the database relation.
   *
   * @tags stream
   * @name StreamControllerRemove
   * @summary delete stream
   * @request DELETE:/api/stream/{id}
   * @secure
   * @response `200` `StreamControllerRemoveData` Stream was deleted
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream not found
   */
  streamControllerRemove = (
    { id }: StreamControllerRemoveParams,
    params: RequestParams = {},
  ) =>
    this.http.request<StreamControllerRemoveData, void>({
      path: `/api/stream/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Returns note cards linked to the stream.
   *
   * @tags note-stream
   * @name NoteStreamControllerFindNotes
   * @summary get stream notes
   * @request GET:/api/stream/{streamId}/notes
   * @secure
   * @response `200` `NoteStreamControllerFindNotesData` Paginated stream notes
   * @response `400` `void` Validation errors or invalid cursor
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream not found
   */
  noteStreamControllerFindNotes = (
    { streamId, ...query }: NoteStreamControllerFindNotesParams,
    params: RequestParams = {},
  ) =>
    this.http.request<NoteStreamControllerFindNotesData, void>({
      path: `/api/stream/${streamId}/notes`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Links a user note to a user stream. Existing links are kept idempotently.
   *
   * @tags note-stream
   * @name NoteStreamControllerAttachNote
   * @summary attach note to stream
   * @request POST:/api/stream/{streamId}/notes/{noteId}
   * @secure
   * @response `201` `NoteStreamControllerAttachNoteData` Note was attached to stream
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream or note not found
   */
  noteStreamControllerAttachNote = (
    { streamId, noteId }: NoteStreamControllerAttachNoteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<NoteStreamControllerAttachNoteData, void>({
      path: `/api/stream/${streamId}/notes/${noteId}`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description Removes only the note-stream link. If the note has no streams after that, it remains a note without stream.
   *
   * @tags note-stream
   * @name NoteStreamControllerDetachNote
   * @summary detach note from stream
   * @request DELETE:/api/stream/{streamId}/notes/{noteId}
   * @secure
   * @response `200` `NoteStreamControllerDetachNoteData` Note was detached from stream
   * @response `401` `void` User is not authorized
   * @response `404` `void` Stream, note, or link not found
   */
  noteStreamControllerDetachNote = (
    { streamId, noteId }: NoteStreamControllerDetachNoteParams,
    params: RequestParams = {},
  ) =>
    this.http.request<NoteStreamControllerDetachNoteData, void>({
      path: `/api/stream/${streamId}/notes/${noteId}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
}
