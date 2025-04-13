package com.young.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.StringUtils;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.aop.SysLog;
import com.young.entity.ExceptionLog;
import com.young.service.ExceptionLogService;
import com.young.util.PageUtils;
import com.young.vo.Json;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Api(tags = {"日志管理"})
@RestController
@RequestMapping("/sys_log")
public class ExceptionLogController {
    private static final Logger logs = LoggerFactory.getLogger(ExceptionLogController.class);

    @Autowired
    ExceptionLogService operateLogService;

    @ApiOperation(value = "查询日志信息")
    @GetMapping("/list")
    public Json exclude(ExceptionLog log) {
        String oper = "list log info";
        logs.info("{}", oper);

        QueryWrapper<ExceptionLog> queryParams = new QueryWrapper<>();
        queryParams.orderByDesc("creat_time");
        if (StringUtils.isNotBlank(log.getUname())) {
            queryParams.like("uname", log.getUname());
        }
        if (StringUtils.isNotBlank(log.getExceptionType())) {
            queryParams.like("exception_type", log.getExceptionType());
        }

        Page<ExceptionLog> page = operateLogService.page(PageUtils.getPageParam(log.getPage(), log.getPageSize()), queryParams);
        return Json.succ().data(page);

    }

    @SysLog
    @ApiOperation(value = "删除日志信息")
    @DeleteMapping
    public Json delete(@RequestBody List<String> ids) {
        String oper = "delete log info";
        logs.info("{}", oper);

        boolean success = operateLogService.remove(new QueryWrapper<ExceptionLog>().in("id", ids));
        return Json.result(oper, success);
    }
}
