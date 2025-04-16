import type {AppRouteModule} from '@/router/types';
import {RoleEnum} from '@/enums/roleEnum';
import {LAYOUT} from '@/router/constant';
import {t} from '@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/account',
  meta: {
    hideChildrenInMenu: false,
    icon: 'ion:settings-outline',
    title: t('routes.system.moduleName'),
    orderNo: 10,
    roles: [RoleEnum.SUPER],
  },
  children: [
    {
      path: 'account',
      name: 'Account',
      component: () => import('@/views/admin/system/Account.vue'),
      meta: {
        title: t('routes.system.account'),
        icon: 'ant-design:user-outlined',
        hideMenu: false,
      },
    },
    {
      path: 'role',
      name: 'Role',
      component: () => import('@/views/admin/system/Role.vue'),
      meta: {
        title: t('routes.system.role'),
        icon: 'carbon:user-role',
      },
    },
    {
      path: 'dept',
      name: 'Department',
      component: () => import('@/views/admin/system/Dept.vue'),
      meta: {
        title: t('routes.system.dept'),
        icon: 'ant-design:apartment-outlined',
      },
    },
    {
      path: 'dict',
      name: 'Dict',
      component: () => import('@/views/admin/system/Dict.vue'),
      meta: {
        title: '字典管理',
        icon: 'ant-design:hdd-outlined',
      },
    },
  ],
};

export default system;
