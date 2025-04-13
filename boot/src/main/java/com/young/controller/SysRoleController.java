package com.young.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.aop.SysLog;
import com.young.entity.SysRole;
import com.young.service.SysRoleService;
import com.young.util.PageUtils;
import com.young.vo.Json;
import com.alibaba.fastjson.JSON;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@Api(tags = {"角色管理"})
@RestController
@RequestMapping("/sys_role")
public class SysRoleController {

    private static final Logger log = LoggerFactory.getLogger(SysRoleController.class);

    @Autowired
    private SysRoleService roleService;

    @SysLog
    @GetMapping("list")
    @ApiOperation(value = "查询角色")
    public Json getRoles(SysRole role) {
        QueryWrapper<SysRole> queryParams = new QueryWrapper<>();
        queryParams.orderByDesc("created");
        queryParams.orderByDesc("updated");
        if (StringUtils.isNotBlank(role.getRname())) {
            queryParams.like("rname", role.getRname());
        }
        Page<SysRole> pages = roleService.page(PageUtils.getPageParam(role.getPage(), role.getPageSize()), queryParams);
        return Json.succ("success").data(pages);
    }

    @SysLog
    @ApiOperation(value = "添加角色")
    @PostMapping
    public Json add(@RequestBody String body) {

        String oper = "add role";
        SysRole role = JSON.parseObject(body, SysRole.class);

        if (StringUtils.isBlank(role.getRval())) {
            return Json.fail(oper, "权限值不能为空");
        }

        SysRole roleDB = roleService.getOne(new QueryWrapper<SysRole>().eq("rval", role.getRval()));
        if (roleDB != null) {
            return Json.fail(oper, "角色值已存在：" + role.getRval());
        }


        role.setCreated(new Date());
        boolean success = roleService.save(role);
        return Json.result(oper, success)
                .data("rid", role.getRid())
                .data("created", role.getCreated());
    }

    @SysLog
    @ApiOperation(value = "修改角色")
    @PutMapping("/update")
    public Json update(@RequestBody String body) {

        String oper = "update role";
        log.info("{}, body: {}", oper, body);

        SysRole role = JSON.parseObject(body, SysRole.class);
        if (StringUtils.isBlank(role.getRid())) {
            return Json.fail(oper, "无法更新角色：参数为空（角色id）");
        }
        role.setUpdated(new Date());
        boolean success = roleService.updateById(role);
        return Json.result(oper, success).data("updated", role.getUpdated());
    }

    @SysLog
    @ApiOperation(value = "删除角色")
    @DeleteMapping
    public Json delete(@RequestBody List<String> ids) {

        String oper = "delete role";
        log.info("{}", oper);

        boolean success = roleService.remove(new QueryWrapper<SysRole>().in("rid", ids));
        return Json.result(oper, success);
    }
}
