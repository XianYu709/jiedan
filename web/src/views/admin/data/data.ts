import { Tag } from 'ant-design-vue';
import { BasicColumn } from '@/components/Table';

import { h } from 'vue';
import { formatToDateTime } from '@/utils/dateUtil';

const colors = {
  Information: 'cyan',
  Trace: 'green',
  Info: 'blue',
  Debug: 'pink',
  Warning: 'orange',
  Error: 'pink',
  Fatal: 'purple',
};

export const columns: BasicColumn[] = [
  {
    title: '数据源',
    dataIndex: 'dataSource',
    width: 180,
  },
  {
    title: '数据集',
    dataIndex: 'dataSet',
    width: 180,
  },
  {
    title: '工作空间',
    dataIndex: 'workSpace',
    width: 180,
  },
  {
    title: 'Url',
    dataIndex: 'url',
    align:'left'
  },
];
