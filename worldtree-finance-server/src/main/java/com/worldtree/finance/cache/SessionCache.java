package com.worldtree.finance.cache;

import com.worldtree.finance.model.UserModel;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

public class SessionCache {

    private static final String KEY_USER_ID = "USER_ID";

    private static final Map<String, UserModel> LOGIN_MAP = new HashMap();

    public synchronized static void setLogin(int userId) {
        UserModel userModel = new UserModel();
        userModel.setUserId(userId);
        LOGIN_MAP.put(getHttpSession().getId(), userModel);
    }

    public synchronized static void removeSession(String sessionId) {
        LOGIN_MAP.remove(sessionId);
    }

    private static HttpSession getHttpSession() {
        HttpServletRequest request =((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return request.getSession();

    }


}
