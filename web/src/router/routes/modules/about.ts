import type { AppRouteModule } from '@/router/types';

import { LAYOUT,IFrame } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const about: AppRouteModule = {
  path: '/about',
  name: 'about',
  component: LAYOUT,
  redirect: '/about/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:read-outlined',
    title: t('routes.dashboard.about'),
    orderNo: 100000,
  },
  children: [
    {
      path: 'index',
      name: 'AboutPage',
      component: () => import('@/views/admin/about/index.vue'),
      meta: {
        title: t('routes.dashboard.about'),
        icon: 'ant-design:read-outlined',
        hideMenu: true,
      },
    },
  ],
};

export default about;
