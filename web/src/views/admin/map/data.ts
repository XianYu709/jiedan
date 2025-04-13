import { BasicColumn } from '@/components/Table';
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'layerName',
    width: 170,
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: 170,
  },
  {
    title: '部门',
    dataIndex: 'deptNameList',
    width: 170,
  },
  {
    title: 'Url',
    dataIndex: 'url',
  },
  {
    title: 'fieldsMap',
    dataIndex: 'fieldsMap',
  },
  {
    title: 'Gis Data Url',
    dataIndex: 'gisDataUrl',
  },
  {
    title: 'Gis Data Key',
    dataIndex: 'gisDataKey',
  },
  {
    title: 'Api Data Url',
    dataIndex: 'apiDataUrl',
  },
];

export interface FormState {
  id: string;
  layerName: string;
  type: string;
  url: string;
  gisDataUrl?: string | [];
  apiDataUrl: string;
  gisDataKey: string;
  deptList: any[];
  fieldsMap: any;
}
