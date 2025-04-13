import { defHttp } from '@/utils/http/axios';
import type { InfoRequest } from './model/accountModel';

enum Api {
  ACCOUNT_LIST = '/sys_user/list',
  ACCOUNT_ADD = '/sys_user/add',
  ACCOUNT_DEL = '/sys_user',
  ACCOUNT_EDIT = '/sys_user/info',
}

const accountInfoApi = (params?: any) =>
  defHttp.get<InfoRequest>({ url: Api.ACCOUNT_LIST, params });

const accountAddApi = (params?: any) =>
  defHttp.post<InfoRequest>({ url: Api.ACCOUNT_ADD, params });

const accountDelApi = (params?: any) =>
  defHttp.delete<InfoRequest>({ url: Api.ACCOUNT_DEL, params });

const accountEditApi = (params?: any) =>
  defHttp.put<InfoRequest>({ url: Api.ACCOUNT_EDIT, params });

export default {
  accountInfoApi,
  accountAddApi,
  accountDelApi,
  accountEditApi,
};
