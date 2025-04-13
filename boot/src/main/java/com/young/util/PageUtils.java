package com.young.util;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

/***
 * 功能描述:分页控制工具类
 * @author Young
 * @date 2022/11/30
 * @return
 * @description
 */

public class PageUtils {

    /**
     * 获取分页参数
     *
     * @param json
     * @return
     */
    public static Page getPageParam(JSONObject json) {
        int current = json.getIntValue("current");
        int size = json.getIntValue("size");
        if (current == 0) current = 1;
        if (size == 0) size = 10;
        return new Page(current, size);
    }

    /**
     * 获取分页参数
     *
     * @param
     * @return
     */
    public static Page getPageParam(int current, int size) {
        if (current == 0) current = 1;
        if (size == 0) size = 10;
        return new Page(current, size);
    }

    /**
     * 功能描述:
     *
     * @param * @param param
     * @return 判断分页大小是否为0
     * @author Young
     * @date 2021/3/1
     */
    public static int getPageSizeByParam(Integer param) {
        int result = 0;
        if (param == null || param == 0) {
            result = 10;
        } else {
            result = param;
        }
        return result;
    }

    /**
     * 功能描述:
     *
     * @param * @param param
     * @return 判断分页当前页是否为0
     * @author Young
     * @date 2021/3/1
     */
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
