import { BasicRequest } from '../../model/baseModel';

type LogRecord = {
  id: string;
  uname: string;
  url: string;
  ip: string;
  exceptionType: any;
  message: any;
  className: string;
  methodName: string;
  methodParams: string;
  returnValue: string;
  creatTime: string;
  page: number;
  pageSize: number;
};

type LogData = {
  records: LogRecord[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  hitCount: boolean;
  countId: any;
  maxLimit: any;
  searchCount: boolean;
  pages: number;
};

export interface LogRequest extends BasicRequest {
  data: LogData;
}
