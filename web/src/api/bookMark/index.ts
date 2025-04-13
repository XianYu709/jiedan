import { defHttp } from '@/utils/http/axios';
import type { markRequest } from './model/markModel';

enum Api {
  Mark_LIST = '/sys_book/bookList',
  Mark_POST = '/sys_book/addBookDataItem',
  Mark_DEL = '/sys_book/deleteItemBook',
}

const MarkListApi = (params?: any) => defHttp.get<markRequest>({ url: Api.Mark_LIST, params });
const MarkAddApi = (params?: any) => defHttp.post<markRequest>({ url: Api.Mark_POST, params });
const MarkDeltApi = (params?: any) => defHttp.delete<markRequest>({ url: Api.Mark_DEL, params });

export default {
  MarkListApi,
  MarkAddApi,
  MarkDeltApi,
};
