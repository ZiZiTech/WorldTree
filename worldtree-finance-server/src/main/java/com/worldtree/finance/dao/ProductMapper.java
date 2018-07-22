package com.worldtree.finance.dao;

import com.worldtree.finance.entity.Product;
import com.worldtree.finance.model.ProductModel;

import java.util.List;

public interface ProductMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Product record);

    Product selectByPrimaryKey(Integer id);

    int updateByPrimaryKey(Product record);

    List<ProductModel> selectByCityId(int cityId);
}