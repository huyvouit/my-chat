import { IResponse } from "./common";

// Param
export interface IParamGetUserInfo {

}

export interface IParamRegister {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface IParamLogin {
  email: string;
  password: string;
}

export interface IParamRefreshToken {
  accessToken: string;
  refreshToken: string;
}

export interface IParamGetListUser {
  ids?: string[];
  notIds?: string[];
  emails?: string[];
  text?: string;
}

export interface IParamGetUserDetail {
  id?: string;
  email?: string;
}

// Response
export interface IResRefreshToken extends IResponse {
  data: IRefreshToken;
}

export interface IResLogin extends IResponse {
  data: IAuthentication;
}

export interface IResRefreshToken extends IResponse {
  data: IRefreshToken;
}
export interface IResGetUserInfo extends IResponse {
  data: IUserModel;
}

export interface IResGetListUser extends IResponse {
  data: IUserModel[];
}

export interface IResGetUserDetail extends IResponse {
  data: IUserModel;
}

// Model
export interface IRefreshToken {
  accessToken: string;
  refreshToken: string;
}

export interface IUserModel {
  id: string;
  name: string;
  firstName: string;
  lastName: number;
  email: string;
  phoneNumber: Date;
  avatar: string;
  linkAvatar: string;
}

export interface IAuthentication {
  userId: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  token?: string;
}