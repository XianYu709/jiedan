import type {AppRouteModule} from '@/router/types';
import {RoleEnum} from '@/enums/roleEnum';
import {LAYOUT} from '@/router/constant';
import {t} from '@/hooks/web/useI18n';

const monitor: AppRouteModule = {
  path: '/monitor',
  name: 'Monitor',
  component: LAYOUT,
  redirect: '/monitor/log',
  meta: {
    icon: 'ant-design:alert-outlined',
    title: t('routes.monitor.moduleName'),
    orderNo: 4,
    roles: [RoleEnum.SUPER],
  },
  children: [
    {
      path: 'log',
      name: 'Log',
      component: () => import('@/views/admin/monitor/Log.vue'),
      meta: {
        title: t('routes.monitor.log'),
        icon: 'ant-design:file-text-outlined',
      },
    },
  ],
};

export default monitor;
