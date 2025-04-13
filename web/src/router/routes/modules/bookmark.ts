import type { AppRouteModule } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const bookmark: AppRouteModule = {
  path: '/bookmark',
  name: 'Bookmark',
  component: LAYOUT,
  redirect: '/bookmark/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'ant-design:book-outlined',
    title: '书签管理',
    orderNo: 3,
    roles: [RoleEnum.SUPER,RoleEnum.EDIT,RoleEnum.SUPERVISION],
  },
  children: [
    {
      path: 'index',
      name: 'BookmarkPage',
      component: () => import('@/views/admin/bookmark/Index.vue'),
      meta: {
        title: '书签管理',
        icon: 'ant-design:book-outlined',
        hideMenu: true,
      },
    },
  ],
};

export default bookmark;
