package com.young.controller;

import lombok.Data;



@Data
public class CustomException extends RuntimeException {

    private int statusCode;
    private String statusMessage;

    public CustomException(int statusCode, String statusMessage) {
        super(statusMessage);
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
    }

}



