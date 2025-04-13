package com.young.util;

import com.young.entity.SysUser;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

/**
 * @author Young
 * @date 2020/1/14 17:13
 * @des
 */
public class UserInfoUtil {

    public static String getUname(){
        Subject subject = SecurityUtils.getSubject();
        SysUser user = (SysUser) subject.getPrincipal();
        if (user==null){
            return "";
        }else{
            return user.getUname();
        }
    }
}
