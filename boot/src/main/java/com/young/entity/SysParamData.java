package com.young.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.Date;

@TableName("sys_param_data" )
@Data
public class SysParamData {

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "id", required = true)
    private String id;

    @ApiModelProperty(value = "字典类型", required = true)
    private String dictType;

    @ApiModelProperty(value = "字典key", required = true)
    private String dictKey;

    @ApiModelProperty(value = "字典value", required = true)
    private String dictValue;

    @ApiModelProperty(value = "描述", required = true)
    private String describe;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    @ApiModelProperty(value = "创建时间", required = true)
    private Date created;

    @ApiModelProperty(value = "修改时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date updated;


    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
}
