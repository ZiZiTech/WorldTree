const fs = require('fs');
const path = require('path');

const Wechat = require('wechat-jssdk');
const MongoStore = Wechat.MongoStore;
const FileStore = Wechat.FileStore;

const DOMAIN = 'http://www.zizizizizi.com';

module.exports = {
  //=====a service account test=====
  domain: DOMAIN,
  wechatToken: "",
  appId: "wx81049d8cf7cce7e1",
  appSecret: "81946fac922e17fd558d3a89e046c556",
  wechatRedirectUrl: `${DOMAIN}/oauth`,
// store: new MongoStore({limit: 5}),
  store: new FileStore({interval: 1000 * 60 * 3}),
  card: false,
  payment: false,
  merchantId: '',
  paymentSandBox: false, //dev env
  paymentKey: '',
  // paymentSandBoxKey: '',
  paymentCertificatePfx: fs.readFileSync(path.join(process.cwd(), 'cert/apiclient_cert.p12')),
  paymentNotifyUrl: `${DOMAIN}/api/wechat/payment/`,
};
