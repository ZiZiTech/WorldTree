package com.worldtree.finance.controller;

import com.alibaba.fastjson.JSONObject;
import com.worldtree.finance.constant.ParamKeys;
import com.worldtree.finance.entity.UserInfo;
import com.worldtree.finance.res.Response;
import com.worldtree.finance.service.UserService;
import com.worldtree.finance.token.TokenUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("finance/user")
public class UserController {

    @Autowired
    private TokenUser tokenUser;

    @Resource
    private UserService userService;



    @RequestMapping("getUserInfo")
    public Response getUserInfo() {
        JSONObject result = new JSONObject();
        UserInfo userInfo = userService.getUserInfoById(tokenUser.getUserId());
        result.put(ParamKeys.KEY_PHONE_NUMBER, userInfo.getPhoneNumber());
        result.put(ParamKeys.KEY_ADDRESS, "江苏省无锡市");
        result.put(ParamKeys.KEY_INTEGRAL, this.userService.getUserIntegral(tokenUser.getUserId()));
        return new Response().success(result);
    }
}
