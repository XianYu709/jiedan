import type {AppRouteModule} from '@/router/types';
import {RoleEnum} from '@/enums/roleEnum';
import {LAYOUT} from '@/router/constant';
import {t} from '@/hooks/web/useI18n';

const system: AppRouteModule = {
  path: '/dangerous',
  name: 'Sangerous',
  component: LAYOUT,
  redirect: '/dangerous/index',
  meta: {
    icon: 'ant-design:database-outlined',
    title: "风险区域管理",
    orderNo: 10,
    roles: [RoleEnum.SUPER],
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'dangerous',
      component: () => import('@/views/admin/emergency/dangerous/index.vue'),
      meta: {
        title: "风险区域管理",
      },
    }
  ],
};

export default system;
