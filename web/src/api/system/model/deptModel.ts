import { BasicRequest } from '../../model/baseModel';

export type Department = {
  did: string;
  dname: string;
  dnotes: null | string;
  dparent: null | string;
  dleaf: boolean;
  dcreated: string;
  dupdated: null | string;
  page: number;
  pageSize: number;
  children: Department[];
};

export interface InfoRequest extends BasicRequest {
  data: Department[];
}
