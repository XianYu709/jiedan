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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <p>
 *
 * </p>
 *
 * @author Young
 * @since 2023-09-05
 */
@TableName("sys_dept" )
@Data
public class SysDept extends Model<SysDept> {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "部门id", required = true)
    private String did;

    @ApiModelProperty(value = "部门名称", required = true)
    private String dname;

    @ApiModelProperty(value = "备注", required = true)
    private String dnotes;

    @ApiModelProperty(value = "父类id", required = true)
    private String dparent;

    @ApiModelProperty(value = "是否叶子节点", required = false)
    private int dleaf;

    @ApiModelProperty(value = "创建时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date dcreated;

    @ApiModelProperty(value = "更新时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8" )
    private Date dupdated;


    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
    @TableField(exist = false)
    @ApiModelProperty(value = "孩子节点-构建树形结构", required = false)
    private List<SysDept> children = new ArrayList<>();

    @Override
    protected Serializable pkVal() {
        return this.did;
    }


}
