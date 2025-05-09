import { UserInfo } from "#/store";

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  uname: string;
  pwd: string;
}

export interface RoleInfo {
  name: string;
  val: string;
}

export interface PermInfo {
  name: string;
  val: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  userInfo:UserInfo,
  roles: RoleInfo[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
