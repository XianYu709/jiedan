import { BasicColumn } from '@/components/Table';
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'bookName',
    width: 170,
  },
  {
    title: '类型',
    dataIndex: 'bookType',
    width: 150,
  },
  {
    title: '日期时间',
    dataIndex: 'bookDate',
    width: 250,
  },
  {
    title: '值',
    dataIndex: 'bookJsonStr',
    align: 'left',
  },
];
