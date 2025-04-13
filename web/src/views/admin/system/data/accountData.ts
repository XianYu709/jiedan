import { BasicColumn } from '@/components/Table';
export const columns: BasicColumn[] = [
  {
    title: '账号',
    dataIndex: 'uname',
    width: 200,
  },
  {
    title: '用户名',
    dataIndex: 'nick',
    width: 200,
  },
  {
    title: '所属角色',
    dataIndex: 'roleName',
    width: 170,
  },
  {
    title: '部门名称',
    dataIndex: 'deptName',
    width: 170,
  },
  {
    title: '注册时间',
    dataIndex: 'created',
    width: 230,
  },
];

export type FormState = {
  uid?: string;
  uname: string;
  nick: string;
  pwd: string;
  avatar?: string | null;
  roleId: string;
  deptId: string;
  roles?: any[];
  perms?: any[];
};
