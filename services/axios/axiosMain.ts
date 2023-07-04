import { message, notification } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { get } from 'react-hook-form';
import { IResponse } from 'services/types/common';
import { common } from 'utils/common';
import { EResponseResult } from 'utils/contants';

const mainURL = process.env.MAIN_URL;
const adminToken = process.env.ADMIN_TOKEN;

const axiosMain = axios.create({
  baseURL: mainURL + 'api/v1.0/',
  headers: {
    'Content-type': 'application/json',
  },
});

axiosMain.interceptors.request.use((config) => {
  const token = common.getToken();
  config.headers.Authorization = !!token ? (`Bearer ` + token) : (adminToken || '');

  return config;
}, (error: AxiosError<any>) => {
  // Do something with request error
  return Promise.reject(error);
});

axiosMain.interceptors.response.use(
  (res: AxiosResponse<IResponse>) => {
    if(res.data.result === EResponseResult.ERROR) {
      notification.error({ message: ``, description: res.data.message });
      throw res;
    }
    if (res.data.message && res.data.result === EResponseResult.SUCCESS) {
      notification.success({ message: ``, description: res.data.message });
    }
    return res;
  },
  (err: AxiosError<any>) => {
    notification.error({
      message: undefined,
      description: get(err, `response.data.message`) || err.message,
    });

    throw err;
  },
);

export default axiosMain;