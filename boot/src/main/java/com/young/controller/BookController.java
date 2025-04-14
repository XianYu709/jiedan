package com.young.controller;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.young.entity.DataBook;
import com.young.service.DataBookService;
import com.young.util.AirUtils;
import com.young.util.PageUtils;
import com.young.vo.Json;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RequestMapping("/sys_book")
@RestController
public class BookController {

    @Autowired
    private DataBookService dataBookService;

    @ResponseBody
    @ApiOperation(value = "查询标签")
    @GetMapping("/bookList")
    public Json getBookList(DataBook dataBook) {
        String oper = "query dataBooksList";

        QueryWrapper<DataBook> dataBookQueryWrapper = new QueryWrapper<>();
        if (AirUtils.hv(dataBook.getBookName())) {
            dataBookQueryWrapper.eq("book_name", dataBook.getBookName());
        }
        Page page = dataBookService.page(PageUtils.getPageParam(dataBook.getPage(), dataBook.getPageSize()), dataBookQueryWrapper);


        return Json.succ(oper).data(page);
    }

    @ResponseBody
    @ApiOperation(value = "根据ID删除标签")
    @DeleteMapping("/deleteItemBook")
    public Json deleteItemBook(@RequestBody List<String> ids) {
        String oper = "";
        boolean success = dataBookService.remove(new QueryWrapper<DataBook>().in("id", ids));
        if (success) {
            oper = "删除成功";
        } else {
            oper = "删除失败";
        }
        return Json.result(oper, success);
    }

    @ResponseBody
    @ApiOperation(value = "新增一条标签")
    @PostMapping("/addBookDataItem")
    public Json addBookDataItem(@RequestBody String body) {
        String oper = "add Book info";
        DataBook ret = JSON.parseObject(body, DataBook.class);
        ret.setBookDate(new Date());
        boolean save = dataBookService.save(ret);

        return Json.succ(oper).data(ret);


    }

}
