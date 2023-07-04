import { EResponseResult } from "utils/contants";
import type { RcFile as OriRcFile, UploadProps as RcUploadProps, UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

export interface IResponse {
  result: EResponseResult;
  errors: { [key: string]: string };
  message: string;
}

export interface IPaginationModel {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  indexFrom: number;
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface IOption {
  label: string;
  value: string;
}

export interface IParamsPagination {
  pageSize?: number;
  pageIndex?: number;
}

export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export interface IUploadFileModel<T = any> {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>['crossOrigin'];
  originFileObj?: RcFile;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
}

export interface RcFile extends OriRcFile {
  readonly lastModifiedDate: Date;
}