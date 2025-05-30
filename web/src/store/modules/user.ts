import type {UserInfo} from '#/store';
import type {ErrorMessageMode} from '#/axios';
import {defineStore} from 'pinia';
import {store} from '@/store';
import {RoleEnum} from '@/enums/roleEnum';
import {PageEnum} from '@/enums/pageEnum';
import {ROLES_KEY, TOKEN_KEY, USER_INFO_KEY} from '@/enums/cacheEnum';
import {getAuthCache, setAuthCache} from '@/utils/auth';
import {GetUserInfoModel, LoginParams} from '@/api/sys/model/userModel';
import {doLogout, getUserInfo, loginApi} from '@/api/sys/user';
import {useI18n} from '@/hooks/web/useI18n';
import {useMessage} from '@/hooks/web/useMessage';
import {router} from '@/router';
import {usePermissionStore} from '@/store/modules/permission';
import {isArray} from '@/utils/is';
import {h} from 'vue';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const {goHome = true, mode, ...loginParams} = params;
        const data = await loginApi(loginParams, mode);
        const {token, userInfo} = data;
        // save token
        this.setToken(token);
        const roles = userInfo.roles.map((it) => it.val);
        const userRole = roles[0];
        const homePathMap = {
          [RoleEnum.SUPER]: '/home',
          [RoleEnum.EDIT]: '/dangerous/index',
          [RoleEnum.OPERATE]: '/home',
          [RoleEnum.SUPERVISION]: '/dangerous/index',
        };
        const homePath = homePathMap[userRole];
        const temp = {...userInfo, homePath};
        console.log('登录成功', temp);

        this.setUserInfo(temp);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        const roles = userInfo.roles.map((it) => it.val);
        const userRole = roles[0];
        const homePathMap = {
          [RoleEnum.SUPER]: '/home',
          [RoleEnum.EDIT]: '/dangerous/index',
          [RoleEnum.OPERATE]: '/home',
          [RoleEnum.SUPERVISION]: '/dangerous/index',
        };
        const homePath = homePathMap[userRole];
        console.log('replace', homePath);

        // await router.replace( homePath);
        setTimeout(async () => {
          await router.push(homePath);
        }, 500)
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const {userInfo} = await getUserInfo();
      const {roles = []} = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.val) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const {createConfirm} = useMessage();
      const {t} = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
          window.localStorage.clear();
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
