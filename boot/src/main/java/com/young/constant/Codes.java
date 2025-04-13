package com.young.constant;

/***
 * 功能描述:响应的code枚举
 * @author Young
 * @date 2022/11/30
 * @return
 * @description
 */

public interface Codes {

    /** 未登录 */
    int UNAUTHEN = 4401;

    /** 未授权，拒绝访问 */
    int UNAUTHZ = 4403;

    /** session超时退出登录 */
    int SESSION_TIMEOUT = 4433;

    /** shiro相关的错误 */
    int SHIRO_ERR = 4444;

    /** 服务端异常 */
    int SERVER_ERR = 5500;

}
