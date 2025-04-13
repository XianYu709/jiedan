package com.young.entity;


import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@TableName("sys_perm")
public class SysPerm extends Model<SysPerm> {

    @TableId(type = IdType.INPUT)
    private String pval;
    private String parent;
    private String pname;
    private Integer ptype;
    private Boolean leaf;
    private Date created;
    private Date updated;

    @TableField(exist = false)
    private List<SysPerm> children = new ArrayList<>();
    @TableField(exist = false)
    private String color;
    @TableField(exist = false)
    private String icon;

    @TableField(exist = false)
    private String[] perms;

    @Override
    protected Serializable pkVal() {
        return pval;
    }

    public String[] getPerms() {
        return perms;
    }

    public void setPerms(String[] perms) {
        this.perms = perms;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Boolean getLeaf() {
        return leaf;
    }

    public void setLeaf(Boolean leaf) {
        this.leaf = leaf;
    }

    public List<SysPerm> getChildren() {
        return children;
    }

    public void setChildren(List<SysPerm> children) {
        this.children = children;
    }

    public String getPval() {
        return pval;
    }

    public void setPval(String pval) {
        this.pval = pval;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    public String getPname() {
        return pname;
    }

    public void setPname(String pname) {
        this.pname = pname;
    }

    public Integer getPtype() {
        return ptype;
    }

    public void setPtype(Integer ptype) {
        this.ptype = ptype;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }
}
