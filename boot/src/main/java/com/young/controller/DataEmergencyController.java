package com.young.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.DataEmergency;
import com.young.service.DataEmergencyService;
import com.young.util.PageUtils;
import com.young.validate.AddGroup;
import com.young.validate.EditGroup;
import com.young.vo.Json;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/data_emergency")
@RestController
public class DataEmergencyController {

    @Autowired
    private DataEmergencyService dataEmergencyService;

    @ApiOperation(value = "查询")
    @GetMapping("/list")
    public Json list(DataEmergency dataEmergency) {
//        String oper = "query dataBooksList";
        LambdaQueryWrapper<DataEmergency> lqw = new LambdaQueryWrapper<>();
        lqw.eq(dataEmergency.getCapacity() != null, DataEmergency::getCapacity, dataEmergency.getCapacity());
        lqw.eq(dataEmergency.getLocation() != null, DataEmergency::getLocation, dataEmergency.getLocation());
        lqw.eq(dataEmergency.getName() != null, DataEmergency::getName, dataEmergency.getName());
        lqw.eq(dataEmergency.getType() != null, DataEmergency::getType, dataEmergency.getType());
        Page page = dataEmergencyService.page(PageUtils.getPageParam(dataEmergency.getPage(), dataEmergency.getPageSize()), lqw);
        return Json.succ().data(page);
    }

    @ApiOperation(value = "新增")
    @PostMapping
    public Json add(@RequestBody @Validated(AddGroup.class) DataEmergency dataEmergency) {
        int add = dataEmergencyService.add(dataEmergency);
        if (add > 0) {
            return Json.succ();
        }
        return Json.fail();
    }

    @ApiOperation(value = "修改")
    @PutMapping
    public Json put(@RequestBody @Validated(EditGroup.class) DataEmergency dataEmergency) {
        dataEmergencyService.put(dataEmergency);
        return Json.succ();
    }

    @ApiOperation(value = "删除")
    @DeleteMapping("/{id}")
    public Json delete(@PathVariable String id) {
        dataEmergencyService.delete(id);
        return Json.succ();
    }


}
