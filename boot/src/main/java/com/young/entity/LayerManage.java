package com.young.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.young.util.JsonbTypeHandler;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

@Data
@TableName(value = "layer_manage", autoResultMap = true)
public class LayerManage extends Model<LayerManage> {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "id", required = true)
    private String id;

    @ApiModelProperty(value = "名称", required = true)
    private String layerName;

    @ApiModelProperty(value = "类型", required = true)
    private String type;

    @ApiModelProperty(value = "url", required = true)
    private String url;

    @ApiModelProperty(value = "gisDataUrl", required = true)
    private String gisDataUrl;

    @ApiModelProperty(value = "apiDataUrl", required = true)
    private String apiDataUrl;

    @ApiModelProperty(value = "gisDataKey", required = true)
    private String gisDataKey;

    @ApiModelProperty(value = "fieldsMap", required = true)
    @TableField(value = "fields_map", typeHandler = JsonbTypeHandler.class)
    private Object fieldsMap;


    @TableField(exist = false)
    @ApiModelProperty(value = "部门(可多选)", required = false)
    private List<SysDept> deptList;

    @TableField(exist = false)
    @ApiModelProperty(value = "部门", required = false)
    private String  deptId;

    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
}
