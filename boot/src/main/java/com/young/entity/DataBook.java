package com.young.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.young.util.JsonbTypeHandler;
import com.young.vo.Json;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;


@TableName("data_book")
@Data
public class DataBook extends Model<DataBook> {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "id", required = true)
    private String id;

    @ApiModelProperty(value = "书签名称", required = true)
    private String bookName;

    @ApiModelProperty(value = "书签类型", required = true)
    private String bookType;

    @ApiModelProperty(value = "时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date bookDate;

    @ApiModelProperty(value = "JSON内容", required = true)
    @TableField(value = "book_json_str", typeHandler = JsonbTypeHandler.class)
    private Object bookJsonStr;

    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

}
