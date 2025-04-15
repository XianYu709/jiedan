import {BasicColumn} from '@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 170,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 170,
  },
  {
    title: '区域',
    dataIndex: 'area',
    width: 170,
  }
];

export interface FormState {
  id: string;
  name: string;
  capacity: string;
  location: string;
}
