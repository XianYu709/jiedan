package com.young.controller;


import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.annotation.PermInfo;
import com.young.aop.SysLog;
import com.young.entity.SysParamData;
import com.young.service.SysParamDataService;
import com.young.util.PageUtils;
import com.young.vo.Json;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;


@Api(tags = {"字典值管理"})
@RestController
@RequestMapping("/sys_param_data")
public class SysParamDataController {

    private static final Logger log = LoggerFactory.getLogger(SysParamDataController.class);
    @Autowired
    private SysParamDataService sysParamDataService;


    @SysLog
    @ApiOperation(value = "查询字典值信息")
    @GetMapping("/list")
    public Json list(SysParamData paramData) {
        String oper = "query paramDataList";
        log.info(oper);

        QueryWrapper<SysParamData> queryParams = new QueryWrapper<>();
        queryParams.orderByDesc("created");
        queryParams.orderByDesc("updated");
        Page<SysParamData> pages = sysParamDataService.page(PageUtils.getPageParam(paramData.getPage(), paramData.getPageSize()), queryParams);

        return Json.succ("success").data(pages);
    }

    @SysLog
    @ApiOperation(value = "添加字典值信息")
    @PostMapping
    public Json add(@RequestBody String body) {
        String oper = "add paramData info";

        SysParamData paramData = JSON.parseObject(body, SysParamData.class);
        paramData.setCreated(new Date());
        boolean save = sysParamDataService.save(paramData);
        return Json.result(oper, save).data(paramData);
    }

    @SysLog
    @ApiOperation(value = "修改字典值信息")
    @PutMapping
    public Json update(@RequestBody SysParamData sysParamData) {
        String oper = "update paramData info";

        sysParamData.setUpdated(new Date());
        boolean success = sysParamDataService.updateById(sysParamData);
        return Json.result(oper, success).data(sysParamData);
    }

    @SysLog
    @ApiOperation(value = "删除字典值信息")
    @DeleteMapping
    public Json delete(@RequestBody List<String> ids) {
        String oper = "delete paramData info";
        log.info("{}", oper);

        boolean success = sysParamDataService.remove(new QueryWrapper<SysParamData>().in("id", ids));
        return Json.result(oper, success);
    }
}


