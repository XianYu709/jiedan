import { BasicRequest } from '../../model/baseModel';

type record = {
  paramId: number;
  paramName: string;
  dictType: string;
  created: string;
  updated: string;
  page: number;
  pageSize: number;
};

type KeyRecordsResponse = {
  records: record[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  hitCount: boolean;
  countId: null | string;
  maxLimit: null | number;
  searchCount: boolean;
  pages: number;
};

type ValueRecord = {
  id: number;
  dictType: string;
  dictKey: string;
  dictValue: string;
  describe: string;
  created: string;
  updated: string;
  page: number;
  pageSize: number;
};

type ValueRecordsResponse = {
  records: ValueRecord[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  hitCount: boolean;
  countId: null | string;
  maxLimit: null | number;
  searchCount: boolean;
  pages: number;
};

export interface KeyRequest extends BasicRequest {
  data: KeyRecordsResponse;
}

export interface ValueRequest extends BasicRequest {
  data: ValueRecordsResponse;
}
