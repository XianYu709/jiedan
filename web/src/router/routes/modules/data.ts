import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const data: AppRouteModule = {
  path: '/data',
  name: 'Data',
  component: LAYOUT,
  redirect: '/data/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:database-outlined',
    title: t('routes.data.moduleName'),
    orderNo: 3,
  },
  children: [
    {
      path: 'index',
      name: 'DataPage',
      component: () => import('@/views/admin/data/Index.vue'),
      meta: {
        title: t('routes.data.config'),
        icon: 'ant-design:database-outlined',
        hideMenu: true,
      },
    },
  ],
};

export default data;
