package com.worldtree.finance.controller;

import com.alibaba.fastjson.JSONObject;
import com.worldtree.finance.constant.ParamKeys;
import com.worldtree.finance.dao.ProductMapper;
import com.worldtree.finance.res.MessageCode;
import com.worldtree.finance.res.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("finance/product")
public class ProductController {
    @Autowired
    private ProductMapper productMapper;

    @RequestMapping("getAllProduct")
    public Response getAllProduct(@RequestBody JSONObject params) {
        if (params == null || !params.containsKey(ParamKeys.KEY_CITY)) {
            return new Response().error(MessageCode.MSG_ERR_PARAMETER);
        }

        return new Response().success();
    }
}
