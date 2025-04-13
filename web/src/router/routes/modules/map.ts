import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';
import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const map: AppRouteModule = {
  path: '/map',
  name: 'Map',
  component: LAYOUT,
  redirect: '/map/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'lets-icons:map-fill',
    title: t('routes.map.moduleName'),
    orderNo: 2,
    roles: [RoleEnum.SUPER,RoleEnum.EDIT,RoleEnum.SUPERVISION],
  },
  children: [
    {
      path: 'index',
      name: 'MapPage',
      component: () => import('@/views/admin/map/Index.vue'),
      meta: {
        title: t('routes.map.config'),
        icon: 'grommet-icons:map',
        hideMenu: true,
      },
    },
  ],
};

export default map;
