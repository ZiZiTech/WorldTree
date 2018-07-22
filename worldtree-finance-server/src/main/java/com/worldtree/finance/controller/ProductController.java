package com.worldtree.finance.controller;

import com.alibaba.fastjson.JSONObject;
import com.worldtree.finance.constant.ParamKeys;
import com.worldtree.finance.res.MessageCode;
import com.worldtree.finance.res.Response;
import com.worldtree.finance.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("finance/product")
//@RequestMapping("product")
public class ProductController {
    @Resource
    private ProductService productService;

    @RequestMapping("getAllProduct")
    public Response getAllProduct(@RequestBody JSONObject params) {
        if (params == null || !params.containsKey(ParamKeys.KEY_CITY_ID)) {
            return new Response().error(MessageCode.MSG_ERR_PARAMETER);
        }
        JSONObject result = new JSONObject();
        result.put(ParamKeys.KEY_PRODUCTS,productService.getCityProduct(params.getInteger(ParamKeys.KEY_CITY_ID)) );
        return new Response().success(result);
    }
}
