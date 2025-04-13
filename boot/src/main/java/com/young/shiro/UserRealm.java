package com.young.shiro;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.young.entity.SysUser;
import com.young.jwt.JwtToken;
import com.young.jwt.JwtUtil;
import com.young.service.SysPermService;
import com.young.service.SysRoleService;
import com.young.service.SysUserService;
import com.young.vo.AuthVo;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;
import java.util.stream.Collectors;

/***
 * 功能描述:这个类是参照JDBCRealm写的，主要是自定义了如何查询用户信息，如何查询用户的角色和权限，如何校验密码等逻辑
 * @author Young
 * @date 2022/11/30
 * @return
 * @description
 */


public class UserRealm extends AuthorizingRealm {

    private static final Logger log = LoggerFactory.getLogger(UserRealm.class);

    @Autowired
    private SysUserService userService;
    @Autowired
    private SysRoleService roleService;
    @Autowired
    private SysPermService permService;


    // 不写该方法，会报错不支持自定义的token
    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof JwtToken;
    }


    /**
     * 授权
     *
     * @param principals
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        if (principals == null) {
            throw new AuthorizationException("PrincipalCollection method argument cannot be null.");
        }

        SysUser user = (SysUser) getAvailablePrincipal(principals);
        Set<AuthVo> roles = user.getRoles();
        Set<AuthVo> perms = user.getPerms();
        log.info("获取角色权限信息: roles: {}, perms: {}", roles, perms);

        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        info.setRoles(roles.stream().map(AuthVo::getVal).collect(Collectors.toSet()));
        info.setStringPermissions(perms.stream().map(AuthVo::getVal).collect(Collectors.toSet()));
        return info;
    }

    /**
     * 登录认证
     *
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {

//        UsernamePasswordToken upToken = (UsernamePasswordToken) token;
//        String username = upToken.getUsername();


        String token = authenticationToken.getPrincipal().toString();
        String username = JwtUtil.getUsername(token);

        if (username == null) {
            throw new AccountException("用户名不能为空");
        }

        SysUser userDB = userService.getOne(new QueryWrapper<SysUser>().eq("uname", username));
        if (userDB == null) {
            throw new UnknownAccountException("找不到用户（" + username + "）的帐号信息");
        }

        //查询用户的角色和权限存到SimpleAuthenticationInfo中，这样在其它地方
        //SecurityUtils.getSubject().getPrincipal()就能拿出用户的所有信息，包括角色和权限
        Set<AuthVo> roles = roleService.getRolesByUserId(userDB.getUid());
        Set<AuthVo> perms = permService.getPermsByUserId(userDB.getUid());
        userDB.getRoles().addAll(roles);
        userDB.getPerms().addAll(perms);

        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(userDB, token, getName());
        if (userDB.getSalt() != null) {
            info.setCredentialsSalt(ByteSource.Util.bytes(userDB.getSalt()));
        }
        return info;

    }


}
