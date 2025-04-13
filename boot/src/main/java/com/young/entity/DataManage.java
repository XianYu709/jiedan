package com.young.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


@TableName("data_manage" )
@Data
public class DataManage extends Model<DataManage> {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "id", required = true)
    private String id;

    @ApiModelProperty(value = "工作空间", required = true)
    private String workSpace;

    @ApiModelProperty(value = "数据源", required = true)
    private String dataSource;

    @ApiModelProperty(value = "数据集", required = true)
    private String dataSet;

    @ApiModelProperty(value = "url", required = true)
    private String url;

    @ApiModelProperty(value = "状态(1:正常 2:新增 3:异常)", required = true)
    private String status;



    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;
}
