import { BasicColumn } from '@/components/Table';

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
    title: '容量',
    dataIndex: 'capacity',
    width: 170,
  },
  {
    title: '位置',
    dataIndex: 'location',
    width: 170,
  },
];

export interface FormState {
  id: string | null;
  name: string | null;
  capacity: string | null;
  location: string | null;
  type: string | null;
}
