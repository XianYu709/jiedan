import { defHttp } from '@/utils/http/axios';
import type { DataRequest } from './model/dataModel';

enum Api {
  DATA_ADD = '/data_manage',
  DATA_DEL = '/data_manage',
  DATA_LIST = '/data_manage/list',
}

const dataListApi = (params?: any) =>
  defHttp.get<DataRequest>({ url: Api.DATA_LIST, params });

const dataAddApi = (params?: any) =>
  defHttp.post<DataRequest>({ url: Api.DATA_ADD, params });

const dataDelApi = (params?: any) =>
  defHttp.delete<DataRequest>({ url: Api.DATA_DEL, params });

export default {
  dataListApi,
  dataAddApi,
  dataDelApi,
};
