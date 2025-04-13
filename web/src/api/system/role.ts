import { defHttp } from '@/utils/http/axios';
import type { RoleRequest } from './model/roleModel';

enum Api {
  ROlE_ADD = '/sys_role',
  ROlE_DEL = '/sys_role',
  ROlE_LIST = '/sys_role/list',
  ROlE_EDIT = '/sys_role/update',
}

const roleListApi = (params?: any) =>
  defHttp.get<RoleRequest>({ url: Api.ROlE_LIST, params });

const roleAddApi = (params?: any) =>
  defHttp.post<RoleRequest>({ url: Api.ROlE_ADD, params });

const roleDelApi = (params?: any) =>
  defHttp.delete<RoleRequest>({ url: Api.ROlE_DEL, params });

const roleEditApi = (params?: any) =>
  defHttp.put<RoleRequest>({ url: Api.ROlE_EDIT, params });

export default {
  roleListApi,
  roleAddApi,
  roleDelApi,
  roleEditApi,
};
