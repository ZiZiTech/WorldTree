package com.worldtree.finance.cache;

import com.worldtree.finance.exception.MessageException;
import com.worldtree.finance.model.VCodeModel;
import com.worldtree.finance.res.MessageCode;
import com.worldtree.finance.utils.WTStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

@Component
public class VCodeCache {
    @Value("${worldtree.finance.sms.login_vcode_timeout}")
    private int loginVCodeTimeout;
    @Value("${worldtree.finance.sms.login_vcode_sent_space}")
    private int loginVCodeSendSpace;


    private static final Map<String, VCodeModel> LOGIN_V_CODE_CACHE_MAP = new HashMap<>();

    public void setLoginVCode(String phoneNumber, String code) {
        this.setVCode(phoneNumber, code, LOGIN_V_CODE_CACHE_MAP);
    }

    private synchronized void setVCode(String phoneNumber, String code, Map<String, VCodeModel> map) {
        VCodeModel model = new VCodeModel();
        model.setPhoneNumber(phoneNumber);
        model.setvCode(code);
        model.setCreateTime(Calendar.getInstance().getTimeInMillis());
        map.put(phoneNumber, model);
    }

    public synchronized void checkLoginVCode(String phoneNumber, String vCode) throws MessageException {
        this.checkVCode(phoneNumber, vCode, LOGIN_V_CODE_CACHE_MAP, loginVCodeTimeout);
    }

    private synchronized void checkVCode(String phoneNumber, String vCode, Map<String, VCodeModel> map, int timeOut) throws MessageException {
        VCodeModel model = map.get(phoneNumber);
        if (model == null) {
            throw new MessageException(MessageCode.MSG_V_CODE_NOT_GET_ERROR);
        } else if (model.getvCode().equals(vCode)) {
            map.remove(phoneNumber);
            if (Calendar.getInstance().getTimeInMillis() - model.getCreateTime() > timeOut) {
                throw new MessageException(MessageCode.MSG_V_CODE_OVER_TIME);
            }
        } else {
            throw new MessageException(MessageCode.MSG_ERR_V_CODE);
        }
    }

    public String getLoginVCode(String phoneNumber, int vCodeLength) throws MessageException {
        return this.getVCode(phoneNumber, vCodeLength, LOGIN_V_CODE_CACHE_MAP, loginVCodeSendSpace);
    }

    public String getVCode(String phoneNumber, int vCodeLength, Map<String, VCodeModel> map, int space) throws MessageException {
        VCodeModel model = map.get(phoneNumber);
        if (model != null && Calendar.getInstance().getTimeInMillis() - model.getCreateTime() > space) {
            throw new MessageException(MessageCode.MSG_V_CODE_SEND_FREQUENCY_TOO_HIGH);
        }
        return WTStringUtils.getVerificationCode(vCodeLength);
    }
}
