package com.young.controller;

import com.young.constant.Codes;
import com.young.dao.ExceptionLogMapper;
import com.young.vo.Json;
import org.apache.shiro.ShiroException;
import org.apache.shiro.authz.UnauthenticatedException;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;


@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @Autowired
    ExceptionLogMapper exceptionLogMapper;

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);


    private static final String GUEST_ONLY = "Attempting to perform a guest-only operation";


    @ExceptionHandler(ShiroException.class)
    @ResponseBody
    public Json handleShiroException(ShiroException e) {
        String eName = e.getClass().getSimpleName();
        log.error("shiro执行出错：{}", eName);
        return new Json(eName, false, Codes.SHIRO_ERR, "鉴权或授权过程出错", null);
    }

    @ExceptionHandler(UnauthenticatedException.class)
    @ResponseBody
    public Json page401(UnauthenticatedException e) {
        String eMsg = e.getMessage();
        if (StringUtils.startsWithIgnoreCase(eMsg, GUEST_ONLY)) {
            return new Json("Unauthenticated", false, Codes.UNAUTHEN, "只允许游客访问，若您已登录，请先退出登录", null)
                    .data("detail", e.getMessage());
        } else {
            return new Json("Unauthenticated", false, Codes.UNAUTHEN, "用户未登录", null)
                    .data("detail", e.getMessage());
        }
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseBody
    public Json page403() {
        return new Json("Unauthorized", false, Codes.UNAUTHZ, "用户没有访问权限", null);
    }

    @ExceptionHandler(CustomException.class)
    @ResponseBody
    public Map<String, Object> handleCustomizeException(CustomException ex) {

        Map<String, Object> result = new HashMap<>();
        result.put("code", ex.getStatusCode());
        result.put("msg", ex.getStatusMessage());
        return result;

    }
}
