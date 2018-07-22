package com.worldtree.finance.service;

import com.worldtree.finance.entity.UserInfo;
import com.worldtree.finance.entity.WxUserInfo;
import org.springframework.transaction.annotation.Transactional;

public interface UserService {
    int getUserIdByOpenId(String openId);
    UserInfo getUserInfoById(int userId);
    UserInfo getUserInfoByPhoneNumber(String phoneNumber);

    @Transactional
    void createWxUser(String openId, String phoneNumber);

    UserInfo createUser(String phoneNumber);

    void saveOrUpdateWxUser(String openId, int userId);

    int getUserIntegral(int userId);
}
