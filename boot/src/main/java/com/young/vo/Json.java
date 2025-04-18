package com.young.vo;

import java.util.HashMap;


public class Json extends HashMap<String, Object> {


    public static final String KEY_OPER = "oper";
    public static final String KEY_SUCC = "succ";
    public static final String KEY_CODE = "code";
    public static final String KEY_MSG = "msg";
    public static final String KEY_DATA = "data";


    public static final String DEFAULT_OPER_VAL = "default";
    public static final int DEFAULT_SUCC_CODE = 200;
    public static final int DEFAULT_FAIL_CODE = -1;
    public static final String DEFAULT_SUCC_MSG = "ok";
    public static final String DEFAULT_FAIL_MSG = "fail";


    public Json() {
        this.put(KEY_OPER, DEFAULT_OPER_VAL);
        this.put(KEY_SUCC, true);
        this.put(KEY_CODE, DEFAULT_SUCC_CODE);
        this.put(KEY_MSG, DEFAULT_SUCC_MSG);
    }


    public Json(String oper) {
        this.put(KEY_OPER, oper);
        this.put(KEY_SUCC, true);
        this.put(KEY_CODE, DEFAULT_SUCC_CODE);
        this.put(KEY_MSG, DEFAULT_SUCC_MSG);
    }


    public Json(String operate, boolean success, int code, String msg, Object data) {
        this.put(KEY_OPER, operate);
        this.put(KEY_SUCC, success);
        this.put(KEY_CODE, code);
        this.put(KEY_MSG, msg);
        if (data != null) {
            this.put(KEY_DATA, data);
        }
    }


    public static Json succ() {
        return new Json();
    }

    public static Json succ(String operate) {
        return new Json(operate, true, DEFAULT_SUCC_CODE, DEFAULT_SUCC_MSG, null);
    }

    public static Json succ(String operate, String message) {
        return new Json(operate, true, DEFAULT_SUCC_CODE, message, null);
    }

    public static Json succ(String operate, Object data) {
        return new Json(operate, true, DEFAULT_SUCC_CODE, DEFAULT_SUCC_MSG, data);
    }

    public static Json succ(String operate, String dataKey, Object dataVal) {
        return new Json(operate, true, DEFAULT_SUCC_CODE, DEFAULT_SUCC_MSG, null)
                .data(dataKey, dataVal);
    }


    public static Json fail() {
        return new Json(DEFAULT_OPER_VAL, false, DEFAULT_FAIL_CODE, DEFAULT_FAIL_MSG, null);
    }

    public static Json fail(String operate) {
        return new Json(operate, false, DEFAULT_FAIL_CODE, DEFAULT_FAIL_MSG, null);
    }

    public static Json fail(String operate, String message) {
        return new Json(operate, false, DEFAULT_FAIL_CODE, message, null);
    }

    public static Json fail(String operate, Object data) {
        return new Json(operate, false, DEFAULT_FAIL_CODE, DEFAULT_FAIL_MSG, data);
    }

    public static Json fail(String operate, String dataKey, Object dataVal) {
        return new Json(operate, false, DEFAULT_FAIL_CODE, DEFAULT_FAIL_MSG, null)
                .data(dataKey, dataVal);
    }


    public static Json result(String operate, boolean success) {
        return new Json(
                operate,
                success,
                (success ? DEFAULT_SUCC_CODE : DEFAULT_FAIL_CODE),
                (success ? DEFAULT_SUCC_MSG : DEFAULT_FAIL_MSG),
                null);
    }

    public static Json result(String operate, boolean success, Object data) {
        return new Json(
                operate,
                success,
                (success ? DEFAULT_SUCC_CODE : DEFAULT_FAIL_CODE),
                (success ? DEFAULT_SUCC_MSG : DEFAULT_FAIL_MSG),
                data);
    }

    public static Json result(String operate, boolean success, String dataKey, Object dataVal) {
        return new Json(
                operate,
                success,
                (success ? DEFAULT_SUCC_CODE : DEFAULT_FAIL_CODE),
                (success ? DEFAULT_SUCC_MSG : DEFAULT_FAIL_MSG),
                null)
                .data(dataKey, dataVal);
    }


    public Json oper(String operate) {
        this.put(KEY_OPER, operate);
        return this;
    }


    public Json succ(boolean success) {
        this.put(KEY_SUCC, success);
        return this;
    }


    public Json code(int code) {
        this.put(KEY_CODE, code);
        return this;
    }


    public Json msg(String message) {
        this.put(KEY_MSG, message);
        return this;
    }


    public Json data(Object dataVal) {
        this.put(KEY_DATA, dataVal);
        return this;
    }


    public Json data(String dataKey, Object dataVal) {
        this.put(dataKey, dataVal);
        return this;
    }


}
