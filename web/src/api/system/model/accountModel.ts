import { BasicRequest } from '../../model/baseModel';

type record = {
  uid: string;
  uname: string;
  nick: string;
  pwd: string;
  salt: string;
  avatar: string | null;
  created: string;
  updated: string;
  roleId: string;
  roleName: string;
  deptId: string;
  deptName: string;
  roles: any[];
  perms: any[];
  page: number;
  pageSize: number;
};

type UserRecordsResponse = {
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

export interface InfoRequest extends BasicRequest {
  data: UserRecordsResponse;
}
