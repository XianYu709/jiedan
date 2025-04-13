package com.young.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.young.vo.AuthVo;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;


import java.io.Serializable;
import java.util.*;


@TableName("sys_user")
@Data
public class SysUser extends Model<SysUser> {

    @TableId(type = IdType.ID_WORKER_STR)
    @ApiModelProperty(value = "账户id", required = true)
    private String uid;

    @ApiModelProperty(value = "登录名", required = true)
    private String uname;

    @ApiModelProperty(value = "账户昵称", required = true)
    private String nick;

    @ApiModelProperty(value = "已加密的登录密码", required = true)
    private String pwd;

    @ApiModelProperty(value = "加密盐值", required = true)
    private String salt;

    @ApiModelProperty(value = "头像", required = true)
    private String avatar;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @ApiModelProperty(value = "创建时间", required = true)
    private Date created;

    @ApiModelProperty(value = "修改时间", required = true)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updated;


    @TableField(exist = false)
    @ApiModelProperty(value = "角色id", required = false)
    private String roleId;
    @TableField(exist = false)
    @ApiModelProperty(value = "角色名称", required = false)
    private String roleName;
    @TableField(exist = false)
    @ApiModelProperty(value = "部门id", required = false)
    private String deptId;
    @TableField(exist = false)
    @ApiModelProperty(value = "部门名称", required = false)
    private String deptName;
    @TableField(exist = false)
    @ApiModelProperty(value = "用户所有角色值，用于shiro做角色权限的判断", required = false)
    private Set<AuthVo> roles = new HashSet<>();
    @TableField(exist = false)
    @ApiModelProperty(value = "用户所有权限值，用于shiro做资源权限的判断", required = false)
    private Set<AuthVo> perms = new HashSet<>();

    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int page;
    @TableField(exist = false)
    @ApiModelProperty(value = "用作分页", required = false)
    private int pageSize;

    @Override
    protected Serializable pkVal() {
        return uid;
    }

}
