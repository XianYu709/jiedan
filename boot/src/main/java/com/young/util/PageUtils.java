package com.young.util;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;


public class PageUtils {


    public static Page getPageParam(JSONObject json) {
        int current = json.getIntValue("current");
        int size = json.getIntValue("size");
        if (current == 0) current = 1;
        if (size == 0) size = 10;
        return new Page(current, size);
    }


    public static Page getPageParam(int current, int size) {
        if (current == 0) current = 1;
        if (size == 0) size = 10;
        return new Page(current, size);
    }


    public static int getPageSizeByParam(Integer param) {
        int result = 0;
        if (param == null || param == 0) {
            result = 10;
        } else {
            result = param;
        }
        return result;
    }


    public static int getPageCurrentByParam(Integer param) {
        int result = 0;
        if (param == null || param == 0) {
            result = 1;
        } else {
            result = param;
        }
        return result;
    }


}
