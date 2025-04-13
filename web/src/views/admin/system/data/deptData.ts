import { BasicColumn } from '@/components/Table';
export const columns = [
  {
    title: '部门名称',
    dataIndex: 'dname',
    width: 300,
  },
  {
    title: '描述',
    dataIndex: 'dnotes',
  },
  {
    title: '创建时间',
    dataIndex: 'dcreated',
  },
];

export type FormState = {
  did?: string;
  dname: string;
  dnotes: string;
  dparent?: string;
  dleaf?: boolean;
  children?: FormState[];
  dcreated?: string;
  dupdated?: string;
};
