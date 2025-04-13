package com.young.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@TableName("sys_param_type" )
@Data
public class SysParamType {


    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "id", required = true)
    private String paramId;

    @ApiModelProperty(value = "字典名称", required = true)
    private String paramName;

    @ApiModelProperty(value = "字典类型", required = true)
    private String dictType;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    @ApiModelProperty(value = "创建时间", required = true)
    private Date created;

    @ApiModelProperty(value = "修改时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date updated;


    @TableField(exist = false)
    @ApiModelProperty(value = "修改前的字典键类型", required = false)
    private String orlDictType;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
}
