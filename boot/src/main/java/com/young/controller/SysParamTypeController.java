package com.young.controller;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.annotation.PermInfo;
import com.young.aop.SysLog;
import com.young.entity.SysParamData;
import com.young.entity.SysParamType;
import com.young.service.SysParamDataService;
import com.young.service.SysParamTypeService;
import com.young.util.AirUtils;
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


@Api(tags = {"字典键管理"})
@RestController
@RequestMapping("/sys_param_type")
public class SysParamTypeController {

    private static final Logger log = LoggerFactory.getLogger(SysParamTypeController.class);
    @Autowired
    private SysParamTypeService sysParamTypeService;
    @Autowired
    private SysParamDataService sysParamDataService;

    @SysLog
    @ApiOperation(value = "查询字典键信息")
    @GetMapping("/list")
    public Json list(SysParamType paramType) {
        String oper = "query paramTypeList";
        log.info(oper);

        QueryWrapper<SysParamType> queryParams = new QueryWrapper<>();
        queryParams.orderByDesc("created");
        queryParams.orderByDesc("updated");
        Page<SysParamType> pages = sysParamTypeService.page(PageUtils.getPageParam(paramType.getPage(), paramType.getPageSize()), queryParams);

        return Json.succ("success").data(pages);
    }

    @SysLog
    @ApiOperation(value = "添加字典键信息")
    @PostMapping
    public Json add(@RequestBody String body) {
        String oper = "add paramType info";

        SysParamType paramType = JSON.parseObject(body, SysParamType.class);
        SysParamType one = sysParamTypeService.getOne(new QueryWrapper<SysParamType>().eq("dict_type", paramType.getDictType()));
        if (AirUtils.hv(one)) {
            return Json.fail(oper, "该键值已存在！");
        }
        paramType.setCreated(new Date());
        paramType.setUpdated(new Date());
        boolean save = sysParamTypeService.save(paramType);
        return Json.result(oper, save).data(paramType);
    }

    @SysLog
    @ApiOperation(value = "修改字典键信息")
    @PutMapping
    public Json update(@RequestBody SysParamType sysParamType) {
        String oper = "update paramType info";

        SysParamType one = sysParamTypeService.getOne(new QueryWrapper<SysParamType>().eq("dict_type", sysParamType.getDictType()));
        if (AirUtils.hv(one) && !one.getParamId().equals(sysParamType.getParamId())) {

            return Json.fail(oper, "该键值已存在！");
        }


        if (AirUtils.hv(sysParamType.getOrlDictType())) {
            List<SysParamData> paramDataList = sysParamDataService.list(new QueryWrapper<SysParamData>().eq("dict_type", sysParamType.getOrlDictType()));
            paramDataList.forEach(data -> {
                data.setDictType(sysParamType.getDictType());
            });
            sysParamDataService.updateBatchById(paramDataList);
        }

        sysParamType.setUpdated(new Date());
        boolean success = sysParamTypeService.updateById(sysParamType);
        return Json.result(oper, success).data(sysParamType);
    }

    @SysLog
    @ApiOperation(value = "删除字典键信息")
    @DeleteMapping
    public Json delete(@RequestBody List<String> ids) {
        String oper = "delete paramType info";
        log.info("{}", oper);


        List<SysParamType> sysParamTypes = sysParamTypeService.listByIds(ids);
        for (SysParamType sysParamType : sysParamTypes) {
            List<SysParamData> paramDataList = sysParamDataService.list(new QueryWrapper<SysParamData>().eq("dict_type", sysParamType.getDictType()));
            paramDataList.forEach(data -> {
                data.setDictType("已删除");
            });
            sysParamDataService.updateBatchById(paramDataList);
        }


        boolean success = sysParamTypeService.remove(new QueryWrapper<SysParamType>().in("param_id", ids));
        return Json.result(oper, success);
    }
}

