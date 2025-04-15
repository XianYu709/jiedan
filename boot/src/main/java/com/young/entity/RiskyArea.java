package com.young.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.young.validate.AddGroup;
import com.young.validate.EditGroup;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;


@TableName("risky_area")
@Data
public class RiskyArea extends Model<RiskyArea> {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER_STR)
    @NotNull(message = "Id不能为空", groups = {EditGroup.class})
    @ApiModelProperty(value = "id", required = true)
    private String id;

    @NotNull(message = "类型不能为空", groups = {AddGroup.class})
    @ApiModelProperty(value = "类型", required = true)
    private String type;

    @NotNull(message = "区域不能为空", groups = {AddGroup.class})
    @ApiModelProperty(value = "区域", required = true)
    private Object area;

    @NotNull(message = "名称不能为空", groups = {AddGroup.class})
    @ApiModelProperty(value = "名称", required = true)
    private String name;

    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;

    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
}
