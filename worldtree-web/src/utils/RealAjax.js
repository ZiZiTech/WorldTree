// import Logger from './Logger';
import superagent from 'superagent';
import globalConfig from '../config';

// const logger = new Logger('Ajax');

/**
 * 封装所有ajax逻辑, 为了配合async/await, 所有ajax请求都要返回promise对象
 */
class Ajax {

    // Ajax工具类提供的方法可以分为2种:
    // 1. 基础的get/post方法, 这些是通用的
    // 2. 在get/post基础上包装的业务方法, 比如getCurrentUser, 这些方法是有业务含义的

    // 作为缓存
    // tableCache = new Map();

    /**
     * 内部方法, 在superagent api的基础上, 包装一些全局的设置
     *
     * @param method 要请求的方法
     * @param url 要请求的url
     * @param params url上的额外参数
     * @param data 要发送的数据
     * @param headers 额外设置的http header
     * @returns {Promise}
     */
    requestWrapper(method, url, {params, data, headers} = {}) {
        // logger.debug('method=%s, url=%s, params=%o, data=%o, headers=%o', method, url, params, data, headers);
        return new Promise((resolve, reject) => {
            const tmp = superagent(method, url);
            // 是否是跨域请求
            if (globalConfig.isCrossDomain()) {
                console.log("isCrossDomainisCrossDomainisCrossDomain")
                tmp.withCredentials();
                // tmp.set('Access-Control-Allow-Origin', "http://192.168.202.234:3000/");
                // tmp.set('Access-Control-Allow-Credentials', 'true')
            }
            // 设置全局的超时时间
            if (globalConfig.api.timeout && !isNaN(globalConfig.api.timeout)) {
                tmp.timeout(globalConfig.api.timeout);
            }
            // 默认的Content-Type和Accept
            tmp.set('Content-Type', 'application/json').set('Accept', 'application/json');
            // 如果有自定义的header
            if (headers) {
                tmp.set(headers);
            }
            // url中是否有附加的参数?
            if (params) {
                tmp.query(params);
            }
            // body中发送的数据
            if (data) {
                console.log("requestWrapper data = " + JSON.stringify(data));
                tmp.send(data);
            }
            // 包装成promise
            tmp.end((err, res) => {
                // logger.debug('err=%o, res=%o', err, res);
                // 我本来在想, 要不要在这里把错误包装下, 即使请求失败也调用resolve, 这样上层就不用区分"网络请求成功但查询数据失败"和"网络失败"两种情况了
                // 但后来觉得这个ajax方法是很底层的, 在这里包装不合适, 应该让上层业务去包装
                if (res && res.body) {
                    resolve(res.body);
                } else {
                    reject(err || res);
                }
            });
        });
    }

    // 基础的get/post方法
    get(url, opts = {}) {
        return this.requestWrapper('GET', url, {...opts});
    }

    post(url, data, opts = {}) {
        const headers = {
            'Content-Type': 'application/json',
            "openId": 'wjswr123',
        };
        console.log("post data = " + JSON.stringify(data));
        return this.requestWrapper('POST', url, {...opts, data, headers});
    }

    // postWithToken(url, data, token, opts = {}) {
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         "FinanceAuth": token,
    //         "openId":'wjswr123',
    //     };
    //     console.log("post data = " + JSON.stringify(data));
    //     return this.requestWrapper('POST', url, {...opts, data, headers});
    // }


    // 业务方法
    // //openId登录
    // loginByOpenId(openId) {
    //     return this.post(`${globalConfig.getAPIPath()}login/loginByOpenId`, {"openId": openId});
    // }

    //获取验证码
    getSmsCode(phoneNumber) {
        return this.post(`${globalConfig.getAPIPath()}finance/login/gst/getLoginCode`, {"phoneNumber": phoneNumber});
    }




    //绑定手机号
    bindWechat(params) {
        return this.post(`${globalConfig.getAPIPath()}finance/login/gst/login`, {
            "vCode": params.vCode,
            "phoneNumber": params.phoneNumber,
        });
    }

    //获取项目详情
    getProductDetail(productCode, saleId) {
        return this.post(`${globalConfig.getAPIPath()}wxUser/userProduct/gst/getProductDetail`, {
            "productCode": productCode,
            "saleId": saleId
        });
    }

    //验证邀请码
    verifyInvitationCode(productCode, saleId, invitationCode) {
        return this.post(`${globalConfig.getAPIPath()}wxUser/userProduct/gst/getProductDetail`, {
            "productCode": productCode,
            "saleId": saleId,
            "invitationCode": invitationCode,
        });
    }

    // //获取产品是否被关注
    // getAttentionProduct(productCode, saleId, token) {
    //     return this.postWithToken(`${globalConfig.getAPIPath()}wxUser/userProduct/getAttentionProduct`, {
    //         "productCode": productCode,
    //         "saleId": saleId
    //     }, token);
    // }

    //关注产品
    attentionProduct(productCode, saleId) {
        return this.post(`${globalConfig.getAPIPath()}finance/userProduct/lgn/attentionProduct`, {
            "productCode": productCode,
            "saleId": saleId
        });
    }

    //判断产品是否被预约
    getProductBookStatus(productCode, saleId) {
        return this.post(`${globalConfig.getAPIPath()}finance/userProduct/lgn/getProductBooked`, {
            "productCode": productCode,
            "saleId": saleId
        });
    }

    //预约产品
    bookProduct(productCode, saleId, bookCount) {
        return this.post(`${globalConfig.getAPIPath()}finance/userProduct/lgn/bookProduct`, {
            "productCode": productCode,
            "saleId": saleId,
            "bookCount": bookCount,
        });
    }

    //获取用户是否认证
    getUserCertification() {
        return this.post(`${globalConfig.getAPIPath()}finance/user/lgn/getUserCertification`, {});
    }

    //用户认证
    certificationUser(data) {
        return this.post(`${globalConfig.getAPIPath()}finance/user/lgn/certificationUser`,
            data);
    }

    //身份证识别
    recognizeID(data) {
        const headers = {
            "Authorization": "APPCODE 30cdc788760a48f5ba391c22473b396c",
        };
        console.log("post data = " + JSON.stringify(data));
        return this.requestWrapper('POST', `${globalConfig.recUrl}`, {
            data,
            headers
        });
    }
}

export default Ajax;
