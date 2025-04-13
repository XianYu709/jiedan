import { BasicRequest } from '../../model/baseModel';

type Record = {
  id: string;
  workSpace: string;
  dataSource: string;
  dataSet: string;
  url: string;
  status: string;
  page: number;
  pageSize: number;
};

type Data = {
  records: Record[];
  total: number;
  size: number;
  current: number;
  orders: any[]; // 此处类型暂且设为 any，根据实际情况进行调整
  optimizeCountSql: boolean;
  hitCount: boolean;
  countId: any; // 同样设为 any 类型
  maxLimit: any; // 设为 any 类型
  searchCount: boolean;
  pages: number;
};

export interface DataRequest extends BasicRequest {
  data: Data;
}
