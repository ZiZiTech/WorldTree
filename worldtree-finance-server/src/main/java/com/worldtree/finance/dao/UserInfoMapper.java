package com.worldtree.finance.dao;

import com.worldtree.finance.entity.UserInfo;

public interface UserInfoMapper {
    int deleteByPrimaryKey(Integer userId);

    int insert(UserInfo record);

    UserInfo selectByPrimaryKey(Integer userId);

    int updateByPrimaryKey(UserInfo record);

    UserInfo selectLastestByPhoneNumber(String phoneNumber);

    Integer getUserIntegral(int userId);
}