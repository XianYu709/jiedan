import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';

import { t } from '@/hooks/web/useI18n';

const data: AppRouteModule = {
   path: '/home',
   name: 'Home',
   component: () => import('@/views/td-map/Home.vue'),
   meta: {
     title: t('routes.basic.home'),
     roles: [RoleEnum.SUPER,RoleEnum.OPERATE],
   },
};

export default data;
