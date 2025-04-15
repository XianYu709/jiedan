import {BasicRequest} from '../../model/baseModel';
import {Department} from '../../system/model/deptModel';

type Data = {
  records: DataItem[];
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

interface DataItem {
  id: string;
  layerName: string;
  type: string;
  url: string;
  gisDataUrl: string;
  apiDataUrl: string;
  gisDataKey: string;
  fieldsMap: {
    type: string;
    value: string;
  };
  deptList: Department[];
  page: number;
  pageSize: number;
}

export interface layerRequest extends BasicRequest {
  data: Data;
}
