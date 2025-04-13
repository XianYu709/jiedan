package com.young.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;


@Data
@TableName("sys_role")
public class SysRole extends Model<SysRole> {

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "角色id", required = true)
    private String rid;

    @ApiModelProperty(value = "角色名", required = true)
    private String rname;

    @ApiModelProperty(value = "角色描述", required = true)
    private String rdesc;

    @ApiModelProperty(value = "角色值-别名", required = true)
    private String rval;

    @ApiModelProperty(value = "创建时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date created;

    @ApiModelProperty(value = "修改时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updated;


    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
    @TableField(exist = false)
    @ApiModelProperty(value = "角色权限", required = false)
    private List<SysPerm> sysPermList;

    @Override
    protected Serializable pkVal() {
        return rid;
    }

}
