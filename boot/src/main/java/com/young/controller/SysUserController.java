package com.young.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.aop.SysLog;
import com.young.entity.*;
import com.young.service.*;
import com.young.util.*;
import com.young.vo.Json;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;


@Api(tags = {"账户管理"})
@RestController
@RequestMapping("/sys_user")
public class SysUserController {

    private static final Logger log = LoggerFactory.getLogger(SysUserController.class);

    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private SysUserRoleService sysUserRoleService;
    @Autowired
    private SysDeptUserService sysDeptUserService;


    @SysLog
    @GetMapping("/list")
    @ApiOperation(value = "查询账户信息")
    public Json getRoles(SysUser user) {
        String oper = "query user";
        log.info(oper);
        Page<SysUser> page = sysUserService.selectUserRoleDept(PageUtils.getPageParam(user.getPage(), user.getPageSize()), user.getNick(), user.getDeptId());
        return Json.succ(oper).data(page);
    }

    @SysLog
    @ApiOperation(value = "新增账户信息")
    @PostMapping("/add")
    public Json add(@RequestBody String body) {

        String oper = "add sys user";
        log.info("{}, body: {}", oper, body);

        SysUser user = JSON.parseObject(body, SysUser.class);

        if (StringUtils.isEmpty(user.getUname())) {
            return Json.fail(oper, "用户帐号名不能为空");
        }
        if (StringUtils.isEmpty(user.getPwd())) {
            return Json.fail(oper, "密码不能为空");
        }
        SysUser userDB = sysUserService.getOne(new QueryWrapper<SysUser>().eq("uname", user.getUname()));
        if (userDB != null) {
            return Json.fail(oper, "用户已注册");
        }
        user.setCreated(new Date());
        boolean success = sysUserService.save(user);

        SysUserRole sysUserRole = new SysUserRole();
        sysUserRole.setUserId(user.getUid());
        sysUserRole.setRoleId(user.getRoleId());
        sysUserRoleService.save(sysUserRole);

        SysDeptUser sysDeptUser = new SysDeptUser();
        sysDeptUser.setDid(user.getDeptId());
        sysDeptUser.setUid(user.getUid());
        sysDeptUserService.save(sysDeptUser);
        return Json.result(oper, success)
                .data("uid", user.getUid())
                .data("created", user.getCreated());
    }

    @SysLog
    @ApiOperation(value = "修改账户信息")
    @PutMapping("/info")
    public Json update(@RequestBody String body) {

        String oper = "update user";
        log.info("{}, body: {}", oper, body);

        SysUser user = JSON.parseObject(body, SysUser.class);


        SysUser userDB = sysUserService.getOne(new QueryWrapper<SysUser>().eq("uname", user.getUname()));
        if (AirUtils.hv(userDB) && !user.getUid().equals(userDB.getUid())) {
            return Json.fail(oper, "用户已注册");
        }

        user.setUpdated(new Date());
        boolean success = sysUserService.updateById(user);


        List<SysUserRole> sysUserRoleList = sysUserRoleService.list(new QueryWrapper<SysUserRole>().eq("user_id", user.getUid()));
        if (sysUserRoleList.size() != 0) {

            boolean deleteSucc = sysUserRoleService.remove(new QueryWrapper<SysUserRole>().eq("user_id", user.getUid()));
            if (!deleteSucc) {
                return Json.fail(oper, "无法解除原来的用户-角色关系");
            }
        }

        sysUserRoleService.save(new SysUserRole(user.getUid(), user.getRoleId()));


        SysDeptUser sysDeptUser = new SysDeptUser();
        sysDeptUser.setDid(user.getDeptId());
        sysDeptUser.setUid(user.getUid());

        LambdaQueryWrapper<SysDeptUser> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(SysDeptUser::getUid, user.getUid());
        SysDeptUser one = sysDeptUserService.getOne(queryWrapper);
        if (AirUtils.hv(one)) {

            sysDeptUserService.remove(queryWrapper);
            sysDeptUserService.save(sysDeptUser);
        } else {

            sysDeptUserService.save(sysDeptUser);
        }
        return Json.result(oper, success).data("updated", user.getUpdated());
    }

    @SysLog
    @ApiOperation(value = "删除账户信息")
    @DeleteMapping
    public Json delete(@RequestBody List<String> ids) {

        String oper = "delete user";
        log.info("{}", oper);

        for (String uid : ids) {
            if (StringUtils.isEmpty(uid)) {
                return Json.fail(oper, "无法删除用户：参数为空（用户id）");
            }


            SysUser user = (SysUser) SecurityUtils.getSubject().getPrincipal();
            if (StringUtils.equals(uid, user.getUid())) {
                return Json.fail(oper, "系统限制：不能删除当前登录账号");
            }
        }

        boolean success = sysUserService.removeByIds(ids);
        sysUserRoleService.remove(new QueryWrapper<SysUserRole>().in("user_id", ids));
        return Json.result(oper, success);
    }

}
