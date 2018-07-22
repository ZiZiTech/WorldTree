package com.worldtree.finance.service.impl;

import com.worldtree.finance.dao.UserInfoMapper;
import com.worldtree.finance.dao.WxUserInfoMapper;
import com.worldtree.finance.entity.UserInfo;
import com.worldtree.finance.entity.WxUserInfo;
import com.worldtree.finance.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service("userService")
public class UserServiceImpl implements UserService {
    @Resource
    private WxUserInfoMapper wxUserInfoMapper;

    @Resource
    private UserInfoMapper userInfoMapper;

    @Override
    public int getUserIdByOpenId(String openId) {
        WxUserInfo wxUserInfo = wxUserInfoMapper.selectByPrimaryKey(openId);
        return wxUserInfo == null ? 0 : wxUserInfo.getUserId();
    }

    @Override
    public UserInfo getUserInfoById(int userId) {
        return userInfoMapper.selectByPrimaryKey(userId);
    }

    @Override
    public UserInfo getUserInfoByPhoneNumber(String phoneNumber) {
        return userInfoMapper.selectLastestByPhoneNumber(phoneNumber);
    }

    @Override
    public void createWxUser(String openId, String phoneNumber) {
        UserInfo userInfo = new UserInfo();
        userInfo.setPhoneNumber(phoneNumber);
        this.userInfoMapper.insert(userInfo);
        WxUserInfo wxUserInfo = new WxUserInfo();
        wxUserInfo.setUserId(userInfo.getUserId());
        wxUserInfo.setOpenId(openId);
        this.wxUserInfoMapper.insert(wxUserInfo);
    }

    @Override
    public UserInfo createUser(String phoneNumber) {
        UserInfo userInfo = new UserInfo();
        userInfo.setPhoneNumber(phoneNumber);
        this.userInfoMapper.insert(userInfo);
        return userInfo;
    }

    @Override
    public void saveOrUpdateWxUser(String openId, int userId) {
        WxUserInfo wxUserInfo = this.wxUserInfoMapper.selectByPrimaryKey(openId);
        if (wxUserInfo == null) {
            wxUserInfo = new WxUserInfo();
            wxUserInfo.setUserId(userId);
            wxUserInfo.setOpenId(openId);
            this.wxUserInfoMapper.insert(wxUserInfo);
        } else {
            wxUserInfo.setUserId(userId);
            this.wxUserInfoMapper.updateByPrimaryKey(wxUserInfo);
        }
    }

    @Override
    public int getUserIntegral(int userId) {
        Integer integral = this.userInfoMapper.getUserIntegral(userId);
        return integral == null ? 0 : integral;
    }
}
