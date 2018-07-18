package com.worldtree.finance.res;

public enum MessageCode {
    MSG_SUCCESS("SUCCESS", 10000),
    MSG_UN_LOGIN("未登录用户限制", 10001),
    MSG_NOT_REGISTER("该用户未注册",10002),
    MSG_ERR_LOGINNAME("登陆名不存在",10003),
    MSG_ERR_PASSWORD("密码错误",10004),
    MSG_RELOGIN("未登录用户限制", 10005),
    MSG_TOKEN_CHEDK_TIMEOUT("Token验证超时", 10006),
    MSG_OUT_OF_RIGHT("权限不足",10007),
    MSG_V_CODE_SEND_TOO_MUCH("验证码超过次数限制",10010),
    MSG_V_CODE_SEND_FREQUENCY_TOO_HIGH("验证码发送过于频繁",10011),
    MSG_ERR_V_CODE("验证码错误",10012),
    MSG_V_CODE_OVER_TIME("验证码超时",10013),
    MSG_V_CODE_SEND_ERROR("验证码发送失败",10014),
    MSG_V_CODE_NOT_GET_ERROR("请先获取验证码",10015),
    MSG_FORBIDDEN_BY_LOGIN_RIGHT("权限受限",10021),
    MSG_FORBIDDEN_BY_TOKEN_RIGHT("未能通过Token验证",10022),
    MSG_TOKEN_HEADER_NOT_FOUND("Token Header缺失",10023),
    MSG_WX_REQUWST_ERROR("微信请求出错",10008),
    MSG_ACCESS_KEY_ERROR("asscessKey 错误",10009),
    MSG_ERR_MOBILE("手机号码错误",20005),
    MSG_REQUEST_URL_ERROR("错误的网络请求",20001),
    MSG_ERR_VCODE("验证码错误",20002),
    MSG_VCODE_TIMEOUT("验证码超时",20003),
    MSG_ERR_PARAMETER("参数异常",20004),
    MSG_CODE_NULL("code不能为空",20006),
    MSG_USER_INFO_GET_ERROR("用户详细信息获取失败",20007),
    MSG_OPEN_ID_NULL("没有找到OpenId",20008),
    MSG_TRADE_NOT_FOUND("找不到该订单",30001),
    MSG_EXIST_MEMBER("已经注册的用户,不能创建订单", 30002),
    MSG_SYSTEM_FILE_RELOAD_ERROR("无法重新加载该系统文件", 40001),
    MSG_ERR_NO_SUCH_RESULT("暂无数据",99992),
    ERR_UNKNOWN_EXCEPTION("未知错误",99999);
    // 成员变量
    private String message;
    private int code;

    // 构造方法
    MessageCode(String message, int code) {
        this.message = message;
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // 覆盖方法
    @Override
    public String toString() {
        return this.code + "-" + this.message;
    }
}
