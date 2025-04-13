import { BasicColumn } from '@/components/Table';
export const columns: BasicColumn[] = [
  {
    title: '职位',
    dataIndex: 'rname',
    width: 180,
  },
  {
    title: '管辖范围',
    dataIndex: 'rdesc',
  },
  {
    title: '创建时间',
    dataIndex: 'created',
  },
];

export type FormState = {
  rid?: string;
  rname: string;
  rdesc: string;
  rval:string;
  created:string;
};