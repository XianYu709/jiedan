import { defHttp } from '@/utils/http/axios';
import type { KeyRequest, ValueRequest } from './model/dicModel';

enum KeyApi {
  KEY_LIST = '/sys_param_type/list',
  KEY_ADD = '/sys_param_type',
  KEY_DEL = '/sys_param_type',
  KEY_EDIT = '/sys_param_type',
}

const keyInfoApi = (params?: any) => defHttp.get<KeyRequest>({ url: KeyApi.KEY_LIST, params });

const keyAddApi = (params?: any) => defHttp.post<KeyRequest>({ url: KeyApi.KEY_ADD, params });

const keyDelApi = (params?: any) => defHttp.delete<KeyRequest>({ url: KeyApi.KEY_DEL, params });

const keyEditApi = (params?: any) => defHttp.put<KeyRequest>({ url: KeyApi.KEY_EDIT, params });

/* ----------------- */

enum ValueApi {
  VALUE_LIST = '/sys_param_data/list',
  VALUE_ADD = '/sys_param_data',
  VALUE_DEL = '/sys_param_data',
  VALUE_EDIT = '/sys_param_data',
}

const ValueInfoApi = (params?: any) =>
  defHttp.get<ValueRequest>({ url: ValueApi.VALUE_LIST, params });

const ValueAddApi = (params?: any) =>
  defHttp.post<ValueRequest>({ url: ValueApi.VALUE_ADD, params });

const ValueDelApi = (params?: any) =>
  defHttp.delete<ValueRequest>({ url: ValueApi.VALUE_DEL, params });

const ValueEditApi = (params?: any) =>
  defHttp.put<ValueRequest>({ url: ValueApi.VALUE_EDIT, params });

export default {
  keyInfoApi,
  keyAddApi,
  keyDelApi,
  keyEditApi,

  ValueInfoApi,
  ValueAddApi,
  ValueDelApi,
  ValueEditApi,
};
