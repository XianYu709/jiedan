import { defHttp } from '@/utils/http/axios';
import type { LogRequest } from './model/logModel';

enum Api {
  LOG_LIST = '/sys_log/list',
}

const logListApi = (params?: any) =>
  defHttp.get<LogRequest>({ url: Api.LOG_LIST, params });

export default {
  logListApi,
};
