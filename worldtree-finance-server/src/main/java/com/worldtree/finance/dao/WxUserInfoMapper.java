package com.worldtree.finance.dao;

import com.worldtree.finance.entity.WxUserInfo;

public interface WxUserInfoMapper {
    int deleteByPrimaryKey(String openId);

    int insert(WxUserInfo record);

    WxUserInfo selectByPrimaryKey(String openId);

    int updateByPrimaryKey(WxUserInfo record);
}