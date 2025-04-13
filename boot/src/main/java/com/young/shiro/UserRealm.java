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


public class UserRealm extends AuthorizingRealm {

    private static final Logger log = LoggerFactory.getLogger(UserRealm.class);

    @Autowired
    private SysUserService userService;
    @Autowired
    private SysRoleService roleService;
    @Autowired
    private SysPermService permService;


    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof JwtToken;
    }


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


    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {


        String token = authenticationToken.getPrincipal().toString();
        String username = JwtUtil.getUsername(token);

        if (username == null) {
            throw new AccountException("用户名不能为空");
        }

        SysUser userDB = userService.getOne(new QueryWrapper<SysUser>().eq("uname", username));
        if (userDB == null) {
            throw new UnknownAccountException("找不到用户（" + username + "）的帐号信息");
        }


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
