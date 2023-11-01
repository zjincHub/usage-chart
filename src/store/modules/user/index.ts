import { defineStore } from 'pinia';
import { login as userLogin, getUserInfo, LoginData } from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: 'admin',
    avatar:
      '//lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png', // 线上图片地址
    // avatar: '/src/assets/images/zhongjiao.png', // 写在 store 中引用属于动态地址 动态地址无法编译 @/ @/ 等价于 src/
    job: undefined,
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: 'admin',
    loginData: undefined,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    // Login
    async login(loginForm: LoginData) {
      this.loginData = loginForm.username; // this 代表 useUserStore 中存储的所有变量
      const obj = {
        name: this.name,
        role: this.role,
        avatar: this.avatar,
        loginData: this.loginData,
      };
      localStorage.setItem('useUserStoreData', JSON.stringify(obj));
      try {
        const res: any = await userLogin(loginForm);
        setToken(res.access_token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    async setLoginData() {
      const userStoreData = JSON.parse(
        localStorage.getItem('useUserStoreData') as string
      );
      this.setInfo(userStoreData);
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        // await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
