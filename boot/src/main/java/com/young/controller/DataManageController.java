package com.young.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.aop.SysLog;
import com.young.entity.DataManage;
import com.young.service.DataManageService;
import com.young.util.AirUtils;
import com.young.util.PageUtils;
import com.young.vo.Json;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;


@Api(tags = {"数据管理"})
@RestController
@RequestMapping("/data_manage")
public class DataManageController {
    private static final Logger log = LoggerFactory.getLogger(DataManageController.class);

    @Autowired
    private DataManageService dataManageService;

    @SysLog
    @ApiOperation(value = "查询数据信息")
    @GetMapping("/list")
    public Json exclude(DataManage dataManage) {
        String oper = "query dataManageList";
        log.info("{}", oper);

        QueryWrapper<DataManage> queryParams = new QueryWrapper<>();
        queryParams.orderByAsc("status");
        if (StringUtils.isNotBlank(dataManage.getWorkSpace())) {
            queryParams.like("work_space", dataManage.getWorkSpace());
        }
        if (StringUtils.isNotBlank(dataManage.getDataSource())) {
            queryParams.like("data_source", dataManage.getDataSource());
        }
        if (StringUtils.isNotBlank(dataManage.getDataSet())) {
            queryParams.like("data_set", dataManage.getDataSet());
        }
        if (StringUtils.isNotBlank(dataManage.getStatus())) {
            queryParams.like("status", dataManage.getStatus());
        }
        Page<DataManage> page = dataManageService.page(PageUtils.getPageParam(dataManage.getPage(), dataManage.getPageSize()), queryParams);
        return Json.succ(oper).data(page);
    }

    @SysLog
    @ApiOperation(value = "同步数据信息")
    @PostMapping
    public Json add(@RequestBody List<DataManage> newDataList) {
        String oper = "add dataManage info";

        // 获取原始数据
        List<DataManage> originalDataList = dataManageService.selectDataManage();
        // 存储处理后的数据
        List<DataManage> dealAfterDataList = new ArrayList<>();

        Map<DataManage, Integer> map = new HashMap<>();
        if (AirUtils.hv(originalDataList)) {
            for (DataManage dataA : originalDataList) {
                map.put(dataA, 3);
            }
        }
        for (DataManage dataB : newDataList) {
            Integer value = map.get(dataB);
            if (value != null) {
                map.put(dataB, 1);
                continue;
            }
            map.put(dataB, 2);
        }
        for (Map.Entry<DataManage, Integer> entry : map.entrySet()) {
            if (entry.getValue() == 1) {
                entry.getKey().setStatus("1");
                //获取正常数据
                dealAfterDataList.add(entry.getKey());
            } else if (entry.getValue() == 2) {
                entry.getKey().setStatus("2");
                //获取新增数据
                dealAfterDataList.add(entry.getKey());
            } else {
                entry.getKey().setStatus("3");
                //获取异常数据
                dealAfterDataList.add(entry.getKey());
            }
        }
        // 删除所有数据
        dataManageService.deleteAll();
        // 新增状态修改后的数据
        boolean saveBatch = dataManageService.saveBatch(dealAfterDataList);

        return Json.result(oper, saveBatch).data(dealAfterDataList);
    }

    @SysLog
    @ApiOperation(value = "删除数据信息")
    @DeleteMapping
    public Json delete(@RequestBody List<String> ids) {
        String oper = "delete dataManage info";
        log.info("{},body:{}", oper);

        boolean success = dataManageService.remove(new QueryWrapper<DataManage>().in("id", ids));
        return Json.result(oper, success);
    }
}
