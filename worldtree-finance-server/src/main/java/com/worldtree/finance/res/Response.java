package com.worldtree.finance.res;

import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Response {
    private static final Logger LOGGER = LoggerFactory.getLogger(Response.class);
    private int code;
    private String message = "success";
    private MessageCode messageCode;
    private JSONObject result;

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public Object getResult() {
        return result;
    }

    public Response success(JSONObject data) {
        code = MessageCode.MSG_SUCCESS.getCode();
        result = data;
//        LOGGER.info(JSON.toJSONString(this));
        return this;
    }


    public Response success() {
        code = MessageCode.MSG_SUCCESS.getCode();
        return this;
    }

    public Response error(MessageCode messageCode) {
        code = messageCode.getCode();
        message = messageCode.getMessage();
//        LOGGER.info(JSON.toJSONString(this));
        return this;
    }
}
