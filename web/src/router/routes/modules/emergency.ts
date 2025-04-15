import type {AppRouteModule} from '@/router/types';
import {RoleEnum} from '@/enums/roleEnum';
import {LAYOUT} from '@/router/constant';
import {t} from '@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/emergency',
  name: 'Emergency',
  component: LAYOUT,
  redirect: '/emergency/index',
  meta: {
    icon: 'ant-design:database-outlined',
    title: t('routes.emergency.emergencyName'),
    orderNo: 10,
    roles: [RoleEnum.SUPER],
  },
  children: [
    {
      path: 'index',
      name: 'Index',
      component: () => import('@/views/admin/emergency/emergency/index.vue'),
      meta: {
        title: t('routes.emergency.emergencyData'),
      },
    },
    {
      path: 'dangerous',
      name: 'dangerous',
      component: () => import('@/views/admin/emergency/dangerous/index.vue'),
      meta: {
        title: "风险区域管理",
      },
    }
  ],
};

export default system;
