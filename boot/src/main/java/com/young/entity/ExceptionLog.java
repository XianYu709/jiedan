package com.young.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("sys_log")
public class ExceptionLog extends Model<ExceptionLog> {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "id", required = true)
    private String id;

    @ApiModelProperty(value = "操作人姓名", required = true)
    private String uname;

    @ApiModelProperty(value = "请求url地址", required = true)
    private String url;

    @ApiModelProperty(value = "请求的ip", required = true)
    private String ip;

    @ApiModelProperty(value = "错误类别", required = true)
    private String exceptionType;

    @ApiModelProperty(value = "错误信息", required = true)
    private String message;

    @ApiModelProperty(value = "操作类名", required = true)
    private String className;

    @ApiModelProperty(value = "操作方法名", required = true)
    private String methodName;

    @ApiModelProperty(value = "操作方法参数", required = true)
    private String methodParams;

    @ApiModelProperty(value = "操作方法返回值", required = true)
    private String returnValue;

    @ApiModelProperty(value = "操作时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date creatTime;



    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
}
