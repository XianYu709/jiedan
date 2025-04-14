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


@TableName("data_emergency")
@Data
public class DataEmergency extends Model<DataEmergency> {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER_STR)
    @NotNull(message = "Id不能为空", groups = {EditGroup.class})
    @ApiModelProperty(value = "id", required = true)
    private String id;

    @NotNull(message = "位置不能为空", groups = {AddGroup.class})
    @ApiModelProperty(value = "位置", required = true)
    private String location;

    @NotNull(message = "容量不能为空", groups = {AddGroup.class})
    @ApiModelProperty(value = "容量", required = true)
    private Double capacity;

    @NotNull(message = "名字不能为空", groups = {AddGroup.class})
    @ApiModelProperty(value = "名字", required = true)
    private String name;

    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;

    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
}
