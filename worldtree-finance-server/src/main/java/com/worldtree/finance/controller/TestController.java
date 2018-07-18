package com.worldtree.finance.controller;

import com.alibaba.fastjson.JSONObject;
import com.worldtree.finance.exception.FinanceControllerException;
import com.worldtree.finance.res.MessageCode;
import com.worldtree.finance.res.Response;
import com.worldtree.finance.token.TokenUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("finance/test")
public class TestController {

    @Autowired
    private TokenUser tokenUser;
    @RequestMapping("test1")
    public Response test1() {
        JSONObject result = new JSONObject();
        result.put("result", "User id is " + tokenUser.getUserId());
        return new Response().success(result);
    }
}
