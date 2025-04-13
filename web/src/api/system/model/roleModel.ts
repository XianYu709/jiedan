import { BasicRequest } from '../../model/baseModel';

type RoleRecord = {
  rid: string;
  rname: string;
  rdesc: string;
  rval: string;
  created: string;
  updated: string | null;
  page: number;
  pageSize: number;
  sysPermList: null;
};

type RoleRecordsResponse = {
  records: RoleRecord[];
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

export interface RoleRequest extends BasicRequest {
  data: RoleRecordsResponse;
}
