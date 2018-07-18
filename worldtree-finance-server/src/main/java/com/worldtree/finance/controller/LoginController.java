package com.worldtree.finance.controller;

import com.alibaba.fastjson.JSONObject;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.worldtree.finance.cache.VCodeCache;
import com.worldtree.finance.constant.ParamKeys;
import com.worldtree.finance.entity.UserInfo;
import com.worldtree.finance.exception.FinanceControllerException;
import com.worldtree.finance.exception.MessageException;
import com.worldtree.finance.res.MessageCode;
import com.worldtree.finance.res.Response;
import com.worldtree.finance.service.UserService;
import com.worldtree.finance.token.TokenHelper;
import com.worldtree.finance.token.TokenObject;
import com.worldtree.finance.utils.ALSmsUtils;
import com.worldtree.finance.utils.WTStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
@RequestMapping("login")
public class LoginController {
    private static final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);

    @Resource
    private ALSmsUtils alSmsUtils;

    @Resource
    private VCodeCache vCodeCache;

    @Autowired
    private TokenHelper tokenHelper;

    @Value("${worldtree.finance.sms.login_vcode_length}")
    private int loginVCodeLength;

    @Resource
    private UserService userService;

    @Value("${jwt.project}")
    private String project;

    @RequestMapping("getLoginCode")
    public Response getLoginCode(@RequestBody JSONObject params) throws FinanceControllerException {
        if (params == null || !params.containsKey(ParamKeys.KEY_PHONE_NUMBER)) {
            throw new FinanceControllerException(MessageCode.MSG_ERR_PARAMETER);
        }
        String phoneNumber = params.getString(ParamKeys.KEY_PHONE_NUMBER);
        if (!WTStringUtils.isPhoneNumber(phoneNumber)) {
            throw new FinanceControllerException(MessageCode.MSG_ERR_MOBILE);
        }
        try {
            String code = vCodeCache.getLoginVCode(phoneNumber, loginVCodeLength);
//            vCodeCache.setLoginVCode(phoneNumber, code);
//            return new Response().success(code);
            SendSmsResponse res = alSmsUtils.sendLoginSms(phoneNumber, code);
            if ("OK".equals(res.getCode())) {
                vCodeCache.setLoginVCode(phoneNumber, code);
                return new Response().success();
            } else {
                StringBuffer sb = new StringBuffer();
                sb.append("VCode send error, phone is ");
                sb.append(phoneNumber);
                sb.append(", Code is ");
                sb.append(res.getCode());
                sb.append(", Message is ");
                sb.append(res.getMessage());
                LOGGER.error(sb.toString());
                return new Response().error(MessageCode.MSG_V_CODE_SEND_ERROR);
            }
        } catch (ClientException e) {
            throw new FinanceControllerException(MessageCode.MSG_V_CODE_SEND_ERROR);
        } catch (MessageException ex) {
            throw new FinanceControllerException(ex.getMessageCode());
        }
    }


    @RequestMapping("login")
    public Response login(@RequestBody JSONObject params) throws FinanceControllerException {
        if (params == null || !params.containsKey(ParamKeys.KEY_PHONE_NUMBER)
                || !params.containsKey(ParamKeys.KEY_V_CODE) || !params.containsKey(ParamKeys.KEY_OPEN_ID)) {
            throw new FinanceControllerException(MessageCode.MSG_ERR_PARAMETER);
        }
        String phoneNumber = params.getString(ParamKeys.KEY_PHONE_NUMBER);
        if (!WTStringUtils.isPhoneNumber(phoneNumber)) {
            throw new FinanceControllerException(MessageCode.MSG_ERR_MOBILE);
        }

        String openId = params.getString(ParamKeys.KEY_OPEN_ID);
        try {
            this.vCodeCache.checkLoginVCode(phoneNumber, params.getString(ParamKeys.KEY_V_CODE));
            UserInfo userInfo = this.userService.getUserInfoByPhoneNumber(phoneNumber);
            if (userInfo == null) {
                userInfo = this.userService.createUser(phoneNumber);
            }
            this.userService.saveOrUpdateWxUser(openId, userInfo.getUserId());
            TokenObject tokenObject = new TokenObject();
            tokenObject.setUserId(userInfo.getUserId());
            tokenObject.setProject(project);
            tokenObject.setPhoneNumber(phoneNumber);
        return new Response().success(tokenHelper.generateToken(tokenObject));
        } catch (MessageException ex) {
            throw new FinanceControllerException(ex.getMessageCode());
        }
    }

    @RequestMapping("loginByOpenId")
    public Response loginByOpenId(@RequestBody JSONObject params) throws FinanceControllerException {
        if (params == null || !params.containsKey(ParamKeys.KEY_OPEN_ID)) {
            throw new FinanceControllerException(MessageCode.MSG_ERR_PARAMETER);
        }
        String openId = params.getString(ParamKeys.KEY_OPEN_ID);
        int userId = this.userService.getUserIdByOpenId(openId);
        if (userId > 0) {
            UserInfo userInfo = this.userService.getUserInfoById(userId);
            if (userInfo != null) {
                TokenObject tokenObject = new TokenObject();
                tokenObject.setUserId(userId);
                tokenObject.setProject(project);
                tokenObject.setPhoneNumber(userInfo.getPhoneNumber());
                return new Response().success(tokenHelper.generateToken(tokenObject));
            } else {
                return new Response().error(MessageCode.MSG_NOT_REGISTER);
            }
        } else {
            return new Response().error(MessageCode.MSG_NOT_REGISTER);
        }
    }
}
