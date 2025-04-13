package com.young.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.young.annotation.PermInfo;
import com.young.aop.SysLog;
import com.young.constant.Codes;
import com.young.entity.SysDept;
import com.young.entity.SysDeptUser;
import com.young.entity.SysUser;
import com.young.jwt.JwtToken;
import com.young.jwt.JwtUtil;
import com.young.service.SysDeptService;
import com.young.service.SysDeptUserService;
import com.young.service.SysUserService;
import com.young.vo.Json;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.UnauthenticatedException;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.util.List;


/***
 * 功能描述: 登陆验证
 * @author Young
 * @date 2022/11/30
 * @return
 * @description
 */

@Api(tags = {"登录模块"})
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    SysDeptService sysDeptService;

    @Autowired
    SysDeptUserService sysDeptUserService;

    @Autowired
    SysUserService sysUserService;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    /**
     * shiro.loginUrl映射到这里，我在这里直接抛出异常交给GlobalExceptionHandler来统一返回json信息，
     * 您也可以在这里直接返回json，不过这样子就跟GlobalExceptionHandler中返回的json重复了。
     *
     * @return
     */
    @RequestMapping("/page/401")
    public Json page401() {
        throw new UnauthenticatedException();
    }

    /**
     * shiro.unauthorizedUrl映射到这里。由于约定了url方式只做鉴权控制，不做权限访问控制，
     * 也就是说在ShiroConfig中如果没有做roles[js],perms[mvn:install]这样的权限访问控制配置的话，是不会跳转到这里的。
     *
     * @return
     */
    @RequestMapping("/page/403")
    public Json page403() {
        throw new UnauthorizedException();
    }

    /**
     * 登录成功跳转到这里，直接返回json。但是实际情况是在login方法中登录成功后返回json了。
     *
     * @return
     */
    @RequestMapping("/page/index")
    public Json pageIndex() {
        return new Json("index", true, 1, "index page", null);
    }

    /**
     * 登录接口，由于UserService中是模拟返回用户信息的，
     * 所以用户名随意，密码123456
     *
     * @param body
     * @return
     */
    @ApiOperation(value = "登录接口", notes = "登录")
    @PostMapping("/login")
    public Json login(@RequestBody String body) {

        String oper = "user login";
        log.info("{}, body: {}", oper, body);

        JSONObject json = JSON.parseObject(body);
        String uname = json.getString("uname");
        String pwd = json.getString("pwd");

        if (StringUtils.isEmpty(uname)) {
            return Json.fail(oper, "用户名不能为空");
        }
        if (StringUtils.isEmpty(pwd)) {
            return Json.fail(oper, "密码不能为空");
        }

        try {
            //登录
            String token = JwtUtil.createToken(uname, 24 * 60 * 60 * 1000L);
            Subject subject = SecurityUtils.getSubject();
            JwtToken jwtToken = new JwtToken(token);
            subject.login(jwtToken);
            //验证密码是否正确
            SysUser user = (SysUser) subject.getPrincipal();
            if (!pwd.equals(user.getPwd())) {
                log.warn("自检测用户密码不正确");
                return Json.fail(oper, "用户帐号或密码不正确");
            }
            if (user == null) {
                throw new AuthenticationException();
            }

//            返回登录用户的信息给前台，含用户的所有角色和权限
            return Json.succ(oper)
                    .data("token", token)
                    .data("userInfo", user)
                    .data("code", 200);

        } catch (UnknownAccountException uae) {
            log.warn("用户帐号不正确");
            return Json.fail(oper, "用户帐号或密码不正确");

        } catch (IncorrectCredentialsException ice) {
            log.warn("用户密码不正确");
            return Json.fail(oper, "用户帐号或密码不正确");

        } catch (LockedAccountException lae) {
            log.warn("用户帐号被锁定");
            return Json.fail(oper, "用户帐号被锁定不可用");

        } catch (AuthenticationException ae) {
            log.warn("登录出错");
            return Json.fail(oper, "登录失败：" + ae.getMessage());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return Json.fail(oper, "登录失败");
    }

    @PostMapping("/logout")
    public Json logout() {
        String oper = "user logout";
        log.info("{}", oper);
        SecurityUtils.getSubject().logout();
        return new Json(oper);
    }

    @SysLog
    @GetMapping("/info")
    public Json info() {
        String oper = "get user info";

        Subject subject = SecurityUtils.getSubject();

        Serializable sessionId = subject.getSession().getId();
        log.info("{}, sessionId: {}", oper, sessionId);

        //从session取出用户信息
        SysUser user = (SysUser) subject.getPrincipal();
        QueryWrapper<SysDeptUser> wrapper = Wrappers.query();
        wrapper.eq("uid", user.getUid());
        SysDeptUser one = sysDeptUserService.getOne(wrapper);
        user.setDeptId(one.getDid());


        if (user == null) {
            //告知前台，登录失效
            return new Json(oper, false, Codes.SESSION_TIMEOUT, "登录已失效", null);
        } else {
            //返回登录用户的信息给前台，含用户的所有角色和权限
            return Json.succ(oper)
                    .data("userInfo", user);
        }


    }

}
