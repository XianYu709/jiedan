package com.young.vo;

import com.alibaba.fastjson.JSON;

import java.util.Objects;


public class AuthVo {


    private String name;
    private String val;

    public AuthVo() {
    }

    public AuthVo(String val) {
        this.val = val;
    }

    public AuthVo(String name, String val) {
        this.name = name;
        this.val = val;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVal() {
        return val;
    }

    public void setVal(String val) {
        this.val = val;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AuthVo authVo = (AuthVo) o;
        return Objects.equals(val, authVo.val);
    }

    @Override
    public int hashCode() {
        return Objects.hash(val);
    }

    @Override
    public String toString() {
        return JSON.toJSONString(this);
    }
}
