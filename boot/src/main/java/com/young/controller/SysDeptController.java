package com.young.controller;


import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.annotation.PermInfo;
import com.young.aop.SysLog;
import com.young.dao.SysDeptMapper;
import com.young.dao.SysUserMapper;
import com.young.entity.*;
import com.young.service.*;
import com.young.util.AirUtils;
import com.young.util.PageUtils;
import com.young.vo.Json;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Api(tags = {"部门管理"})
@RestController
@RequestMapping("/sys_dept")
public class SysDeptController {

    private static final Logger log = LoggerFactory.getLogger(SysDeptController.class);
    @Autowired
    private SysDeptService sysDeptService;


    @SysLog
    @ApiOperation(value = "查询部门信息")
    @GetMapping("/list")
    public Json exclude(SysDept dept) {
        String oper = "query deptList";
        log.info("{}", oper);

        List<SysDept> list = sysDeptService.list();
        List<SysDept> listTree = sysDeptService.builTree(list);
        return Json.succ("success")
                .data(listTree);
    }

    @SysLog
    @ApiOperation(value = "添加部门信息")
    @PostMapping
    public Json add(@RequestBody String body) {
        String oper = "add dept info";
        SysDept dept = JSON.parseObject(body, SysDept.class);
        if (StringUtils.isEmpty(dept.getDname())) {
            return Json.fail(oper, "部门名称不能为空");
        }
        if (AirUtils.hv(dept.getDparent())) {
            dept.setDleaf(1);
        } else {
            dept.setDleaf(0);
        }
        dept.setDcreated(new Date());
        boolean save = sysDeptService.save(dept);
        return Json.result(oper, save).data(dept);
    }

    @SysLog
    @ApiOperation(value = "修改部门信息")
    @PutMapping
    public Json update(@RequestBody SysDept dept) {
        String oper = "update  dept info";

        if (!AirUtils.hv(dept)) {
            return Json.fail("did参数为空");
        }
        if (AirUtils.hv(dept.getDparent())) {
            dept.setDleaf(1);
        } else {
            dept.setDleaf(0);
        }
        dept.setDupdated(new Date());
        boolean success = sysDeptService.updateById(dept);
        return Json.result(oper, success).data(dept);
    }

    @SysLog
    @ApiOperation(value = "删除部门信息")
    @DeleteMapping
    public Json delete(@RequestBody List<String> ids) {
        String oper = "delete dept info";
        log.info("{},body:{}", oper);


        List<SysDept> sysDeptList = sysDeptService.listByIds(ids);
        for (SysDept sysDept : sysDeptList) {
            List<SysDept> sysDepts = sysDeptService.list(new QueryWrapper<SysDept>().eq("dparent", sysDept.getDid()));
            List<String> dids = sysDepts.stream().map(SysDept::getDid).collect(Collectors.toList());
            sysDeptService.removeByIds(dids);
        }

        boolean success = sysDeptService.remove(new QueryWrapper<SysDept>().in("did", ids));
        return Json.result(oper, success);
    }
}

