package com.young.aop;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.auth0.jwt.JWT;
import com.young.controller.CustomException;
import com.young.dao.ExceptionLogMapper;
import com.young.entity.ExceptionLog;
import com.young.util.AirUtils;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@Slf4j
@Aspect
@Component
public class SysLogAspect {

    @Autowired
    private HttpServletRequest request;
    @Autowired
    private ExceptionLogMapper exceptionLogMapper;

    @Around("@annotation(com.young.aop.SysLog)")
    public Object LogAspect(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {

        ExceptionLog operateLog = new ExceptionLog();
        String jwt = request.getHeader("Authorization");
        // 使用之前编写好的解析JWT令牌的工具类来解析获取到的JWT令牌
        // 获取用户名
        if (AirUtils.hv(jwt)) {
            String uname = JWT.decode(jwt).getClaim("uname").asString();
            // 获取url
            String url = request.getRequestURI();
            // 获取ip
            String ip = request.getRemoteAddr();
            // 获取操作时间
            Date creatTime = new Date();
            // 获取操作类名
            String classname = proceedingJoinPoint.getTarget().getClass().getName();
            // 获取操方法名
            String methodName = proceedingJoinPoint.getSignature().getName();
            // 获取操作方法参数
            Object[] args = proceedingJoinPoint.getArgs();
            String methodParams = JSON.toJSONString(args);

            Object result;
            String returnValue = "";
            try {
                result = proceedingJoinPoint.proceed();

                // 获取操作方法返回值
                returnValue = JSONObject.toJSONString(result);
                operateLog = new ExceptionLog(null, uname, url, ip, null, null, classname, methodName, methodParams, returnValue, creatTime, 0, 0);

            } catch (Exception e) {
                String exceptionType = e.getClass().getName();
                String message = e.getMessage();

                operateLog = new ExceptionLog(null, uname, url, ip, exceptionType, message, classname, methodName, methodParams, returnValue, creatTime, 0, 0);
                throw e;
            } finally {
                exceptionLogMapper.insert(operateLog);
            }

            return result;
        } else {
            throw new CustomException(400, "未携带token令牌！");
        }
    }


}
