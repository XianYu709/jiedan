import { BasicColumn } from '@/components/Table';
export const keyColumns: Array<Object> = [
  {
    title: '键名',
    dataIndex: 'paramName',
    width: 200,
  },
];

export const ValueColumn: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'dictValue',
    width: 180,
  },
  {
    title: '键值',
    dataIndex: 'dictKey',
    width: 180,
  },
  {
    title: '描述',
    dataIndex: 'describe',
  },
];

export type FormState = {
  paramId?: string /* 键名ID */;
  paramName?: string /* 键名 */;
  dictType: string /* 键类型 */;

  orlDictType?:string;
  id?: string /* 值id */;
  dictKey?: string /* 键值（值） */;
  dictValue?: string /* 值名称*/;
  describe?: string /* 值描述 */;
};



 