import { AxiosResponse } from "axios";
import { IFileFormDataBody, IFileStoreModel, IResFileStore } from "services/types/file-store";
import { IParamLogin, IParamRefreshToken, IResLogin, IResRefreshToken } from "services/types/user";
import axiosMain from "../axios/axiosMain";

const basicUrl = 'file-store/';

export const apiFileStore = {
  upload: (body: FormData, config): Promise<AxiosResponse<IResFileStore<IFileStoreModel[]>>> => {
    const url = basicUrl + 'upload';
    return axiosMain.post(url, body, config);
  },
};
