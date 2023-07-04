import { NormalStatus } from "utils/contants";
import { IResponse } from "./common";

export interface IResFileStore<T> extends IResponse {
  data?: T;
}

export interface IFileStoreModel {
  id: string;
  name: string;
  link: string;
  description?: string;
  mimetype?: string;
  size?: number;
  status: NormalStatus;
}
export interface IFileFormDataBody {
  [key: string]: string | Blob;
}