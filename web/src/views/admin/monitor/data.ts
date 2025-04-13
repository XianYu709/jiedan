import { BasicColumn } from '@/components/Table';
export const columns: BasicColumn[] = [
  {
    title: '操作人',
    dataIndex: 'uname',
    width: 170,
  },
  {
    title: '请求IP',
    dataIndex: 'ip',
    width: 170,
  },
  {
    title: '请求URL地址',
    dataIndex: 'url',
    width: 170,
  },
  {
    title: '信息',
    dataIndex: 'message',
  },
  {
    title: '错误类型',
    dataIndex: 'exceptionType',
  },
  {
    title: '方法参数',
    dataIndex: 'methodParams',
  },
  {
    title: '方法返回值',
    dataIndex: 'returnValue',
  },
  {
    title: '操作时间',
    dataIndex: 'creatTime',
  },
];

export interface FormState {
  id?: string;
  uname: string;
  ip: string;
  url: string;
  className: string;
  methodName: string;
  methodParams: string;
  returnValue: string;
  creatTime: Object;
}
