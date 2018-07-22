package com.worldtree.finance.service.impl;

import com.worldtree.finance.dao.ProductMapper;
import com.worldtree.finance.model.ProductModel;
import com.worldtree.finance.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("productService")
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductMapper productMapper;


    @Override
    public List<ProductModel> getCityProduct(int cityId) {
        return productMapper.selectByCityId(cityId);
    }
}
