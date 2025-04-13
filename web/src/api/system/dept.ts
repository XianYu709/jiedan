import { defHttp } from '@/utils/http/axios';
import type { InfoRequest } from './model/deptModel';

enum Api {
  DEPT_LIST = '/sys_dept/list',
  DEPT_ADD = '/sys_dept',
  DEPT_DEL = '/sys_dept',
  DEPT_EDIT = '/sys_dept',
}

export const deptInfoApi = (params?: any) =>
  defHttp.get<InfoRequest>({ url: Api.DEPT_LIST, params });

export const deptAddApi = (params?: any) =>
  defHttp.post<InfoRequest>({ url: Api.DEPT_ADD, params });

export const deptDelApi = (params?: any) =>
  defHttp.delete<InfoRequest>({ url: Api.DEPT_DEL, params });

export const deptEditApi = (params?: any) =>
  defHttp.put<InfoRequest>({ url: Api.DEPT_EDIT, params });

export default {
  deptInfoApi,
  deptAddApi,
  deptDelApi,
  deptEditApi,
};
