package com.young.controller;

import com.alibaba.fastjson.JSONArray;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.RiskyArea;
import com.young.service.RiskyAreaService;
import com.young.util.PageUtils;
import com.young.validate.AddGroup;
import com.young.validate.EditGroup;
import com.young.vo.Json;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/risky_area")
@RestController
public class RiskyAreaController {

    @Autowired
    private RiskyAreaService riskyAreaService;

    @ApiOperation(value = "查询")
    @GetMapping("/list")
    public Json list(RiskyArea riskyArea) {
//        String oper = "query dataBooksList";
        LambdaQueryWrapper<RiskyArea> lqw = new LambdaQueryWrapper<>();
        lqw.eq(riskyArea.getType() != null, RiskyArea::getType, riskyArea.getType());
        lqw.eq(riskyArea.getName() != null, RiskyArea::getName, riskyArea.getName());
        Page<RiskyArea> page = riskyAreaService.page(PageUtils.getPageParam(riskyArea.getPage(), riskyArea.getPageSize()), lqw);
        page.getRecords().forEach(item -> {
            item.setArea(JSONArray.parseArray((String) item.getArea()));
        });
        return Json.succ().data(page);
    }

    @ApiOperation(value = "新增")
    @PostMapping
    public Json add(@RequestBody @Validated(AddGroup.class) RiskyArea riskyArea) {
        riskyArea.setArea(riskyArea.getArea().toString());
        int add = riskyAreaService.add(riskyArea);
        if (add > 0) {
            return Json.succ();
        }
        return Json.fail();
    }

    @ApiOperation(value = "修改")
    @PutMapping
    public Json put(@RequestBody @Validated(EditGroup.class) RiskyArea riskyArea) {
        riskyAreaService.put(riskyArea);
        return Json.succ();
    }

    @ApiOperation(value = "删除")
    @DeleteMapping("/{id}")
    public Json delete(@PathVariable String id) {
        riskyAreaService.delete(id);
        return Json.succ();
    }


}
