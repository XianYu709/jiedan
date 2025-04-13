package com.young.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@TableName(value = "layer_dept")
public class LayerDept extends Model<LayerDept> {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "部门id", required = true)
    private String did;

    @ApiModelProperty(value = "图层id", required = true)
    private String layerId;
}
