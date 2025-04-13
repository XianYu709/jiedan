package com.young.aop;

import java.lang.annotation.*;

/**
 * 系统日志注解(定义)
 *
 * @Retention 运行时可见，通过反射机制获取到
 * @Target 注解应用于方法和类参数，在方法参数上可以使用该注解
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface SysLog {
}
