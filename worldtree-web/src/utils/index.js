const Utils = {
    isWeixin() {
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') !== -1;
        if (!isWeixin) {
            document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
            document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>';
            return;
        }
    }
};

export function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    var isWeixin = ua.indexOf('micromessenger') !== -1;
    if (!isWeixin) {
        document.head.innerHTML = '<title>抱歉，出错了</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0"><link rel="stylesheet" type="text/css" href="https://res.wx.qq.com/open/libs/weui/0.4.1/weui.css">';
        document.body.innerHTML = '<div class="weui_msg"><div class="weui_icon_area"><i class="weui_icon_info weui_icon_msg"></i></div><div class="weui_text_area"><h4 class="weui_msg_title">请在微信客户端打开链接</h4></div></div>';
        return;
    }
}

export function ValidateMobile(mobile) {
    if (mobile.length === 0) {
        // alert('请输入手机号码！');
        return false;
    }
    if (mobile.length !== 11) {
        // alert('请输入有效的手机号码！');
        return false;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
        // alert('请输入有效的手机号码！');
        return false;
    }
    return true;
}

export function Trim(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() === "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

export function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
};


export default Utils;
