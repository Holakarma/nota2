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
  AuthControllerLogoutData,
  AuthControllerRefreshData,
  AuthControllerSignInData,
  AuthControllerSignUpData,
  SignInRequestDto,
  SignUpRequestDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Auth<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * @description create user row
   *
   * @tags auth
   * @name AuthControllerSignUp
   * @summary register
   * @request POST:/api/auth/sign-up
   * @response `200` `AuthControllerSignUpData`
   * @response `400` `void` Validation errors
   * @response `409` `void` User with this login is already esists
   */
  authControllerSignUp = (data: SignUpRequestDto, params: RequestParams = {}) =>
    this.http.request<AuthControllerSignUpData, void>({
      path: `/api/auth/sign-up`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description get tokens pair
   *
   * @tags auth
   * @name AuthControllerSignIn
   * @summary login
   * @request POST:/api/auth/sign-in
   * @response `200` `AuthControllerSignInData`
   * @response `400` `void` Validation errors
   * @response `404` `void` User not found
   */
  authControllerSignIn = (data: SignInRequestDto, params: RequestParams = {}) =>
    this.http.request<AuthControllerSignInData, void>({
      path: `/api/auth/sign-in`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description get tokens pair by refresh token
   *
   * @tags auth
   * @name AuthControllerRefresh
   * @summary refresh tokens
   * @request POST:/api/auth/refresh
   * @response `200` `AuthControllerRefreshData`
   * @response `401` `void` invalid refresh token
   */
  authControllerRefresh = (params: RequestParams = {}) =>
    this.http.request<AuthControllerRefreshData, void>({
      path: `/api/auth/refresh`,
      method: "POST",
      format: "json",
      ...params,
    });
  /**
   * @description delete reshresh token cookie
   *
   * @tags auth
   * @name AuthControllerLogout
   * @summary logout
   * @request POST:/api/auth/sign-out
   * @response `200` `AuthControllerLogoutData`
   */
  authControllerLogout = (params: RequestParams = {}) =>
    this.http.request<AuthControllerLogoutData, any>({
      path: `/api/auth/sign-out`,
      method: "POST",
      ...params,
    });
  /**
   * No description
   *
   * @tags auth
   * @name AuthControllerMe
   * @summary get current user
   * @request GET:/api/auth/me
   * @response `401` `void` invalid refresh token
   */
  authControllerMe = (params: RequestParams = {}) =>
    this.http.request<any, void>({
      path: `/api/auth/me`,
      method: "GET",
      ...params,
    });
}
