import { BasicRequest } from '../../model/baseModel';

type MarkRecord = {
  id: string;
  bookName: string;
  bookType: string;
  bookDate: string;
  bookJsonStr: {
    type: string;
    value: string;
  };
  page: number;
  pageSize: number;
};

type MarkData = {
  records: MarkRecord[];
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

export interface markRequest extends BasicRequest {
  data: MarkData;
}
