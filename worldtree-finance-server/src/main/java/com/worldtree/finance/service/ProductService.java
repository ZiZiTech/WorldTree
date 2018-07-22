package com.worldtree.finance.service;

import com.worldtree.finance.model.ProductModel;

import java.util.List;

public interface ProductService {
    List<ProductModel> getCityProduct(int cityId);
}
