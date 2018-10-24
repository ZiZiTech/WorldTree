import React, {Component} from 'react';
import './Home.css';
import {
    Toast,
    NavBar,
    Flex,
    Icon,
    Progress,
    List,
    WingBlank,
    WhiteSpace,
    Modal, Stepper
} from "antd-mobile";
import EXIF from 'exif-js'
import {Trim, ValidateMobile, GetQueryString} from "../utils";
import ajax from "../utils/ajax";
import head from './images/head.png'
import ProductItem from "../compont/ProductItem";
import CodeBox from "../compont/CodeBox"
import IconMine from './images/icon-mine.png'


import IconLocation from './images/icon-location.png'
import IconLocationBlack from './images/icon-location-black.png'
import IconLogo from './images/icon-logo.png'
import IconBook from './images/icon-book.png'
import IconAttention from './images/icon-attention.png'
import IconRealName from './images/icon-realname.png'
import ImageProductDetail01 from './images/image-product-detail01.png'
import BgProductItem from './images/bg-product-item.png'
import BgUploadId from './images/bg-upload-id.png'
import cabin from '../utils/Logger';

const wx = window.jWeixin || require('weixin-js-sdk')
const urlencode = require('urlencode');
const Item = List.Item;

const smsRequestInterval = 60;
const saleId = 1;
const productCode = "100010000";
const totalCount = 300;
const eachCountFigure = 20000;

const code = GetQueryString('code')
const nav_to = GetQueryString('nav_to')


const maxSize = 10 * 1024; // 10MB
const compressMaxSize = 2 * 1024;
const typeArray = ['jpeg', 'jpg', 'png'];

// const Wechat = require('wechat-jssdk');
// const wechatConfig = require('../wechat-config');
// const wx = new Wechat(wechatConfig);

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //控制页面显示标记
            toHome: false,
            toMine: false,
            toLogin: false,
            toAttentionProductList: false,
            toBookedProductList: false,
            toUserCertification: true,
            toAttentionProductDetail: false,
            toBookedProductDetail: false,

            //是否显示邀请码输入modal
            invitationCodeModal: false,
            //邀请码
            invitationCode: '',
            //邀请码是否验证成功
            verityInvitationCodeCorrect: true,
            //验证码相关
            secondsElapsed: smsRequestInterval,
            phone: 18,
            phoneIsCorrect: false,
            showCode: false,
            smsCode: '',
            smsCodeIsCorrect: false,

            //用户凭证
            // openId: 'wjswr123',
            token: '',

            //是否完成实名认证
            userCertification: false,

            //预约份额
            bookCount: 1,
            bookTime: '',
            startSaleTime: '2018/12/14',
            //是否关注了saleId为1的产品
            attentionSale: false,
            //是否预约了saleId为1的产品
            bookSale: false,
            //身份证
            faceIdImageBase64Data: '',
            faceImageLoaded: false,
            faceRecognized: false,
            backIdImageBase64Data: '',
            backRecognized: false,
            backImageLoaded: false,

            //总预约份数
            totalBookedCount: 0,
            //我预约份数
            myBookedCount: 0,

            needCompress: true,
        };

        this.showPage = this.showPage.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onWrapTouchStart = this.onWrapTouchStart.bind(this);
        this.tick = this.tick.bind(this);
        this.getSmsCode = this.getSmsCode.bind(this);
        this.showOrCloseCodeInputView = this.showOrCloseCodeInputView.bind(this);
        this.toProjectDetail = this.toProjectDetail.bind(this);
        this.checkUserCertificationStatus = this.checkUserCertificationStatus.bind(this);
        this.onBookCountChange = this.onBookCountChange.bind(this);
        this.verifyInvitationCode = this.verifyInvitationCode.bind(this);
        this.onInvitationCodeChange = this.onInvitationCodeChange.bind(this);
        this.tryToAttentionProductList = this.tryToAttentionProductList.bind(this);
        this.tryToBookProductList = this.tryToBookProductList.bind(this);
        this.tryToAttentionProductDetail = this.tryToAttentionProductDetail.bind(this);
        this.bookProduct = this.bookProduct.bind(this);
        this.onIDImagesChange = this.onIDImagesChange.bind(this);
        this.recognizeID = this.recognizeID.bind(this);
        this.onFaceIDImagesChange = this.onFaceIDImagesChange.bind(this);
        this.onBackIDImagesChange = this.onBackIDImagesChange.bind(this);
        this.handleRecognize = this.handleRecognize.bind(this);
        this.transformFileToDataUrl = this.transformFileToDataUrl.bind(this);
        this.previewResponse = this.previewResponse.bind(this);
        this.configWechatJSSDK = this.configWechatJSSDK.bind(this);
        this.compress = this.compress.bind(this);
    }

    previewResponse(res) {
        if (res === undefined) {
            Toast.fail("服务器出错");
            return;
        } else {
            if (res.code === 10001) {
                Toast.info("请先登录");
                this.showPage('toLogin')
                return;
            }
        }
    }

    compress(data, file, callback) {
        /**
         * 压缩图片
         * @param data file文件 数据会一直向下传递
         * @param callback 下一步回调
         */

        cabin.info("compress  begin" + JSON.stringify(data))
        const compress = true;
        const compressionRatio = 20;
        const imgCompassMaxSize = 200 * 1024; // 超过 200k 就压缩
        // const imgFile = data.file;
        // const orientation = data.orientation;
        const img = new window.Image();

        img.onload = function () {

            let drawWidth, drawHeight, width, height;

            drawWidth = this.naturalWidth;
            drawHeight = this.naturalHeight;

            // 改变一下图片大小
            let maxSide = Math.max(drawWidth, drawHeight);

            if (maxSide > 1024) {
                let minSide = Math.min(drawWidth, drawHeight);
                minSide = minSide / maxSide * 1024;
                maxSide = 1024;
                if (drawWidth > drawHeight) {
                    drawWidth = maxSide;
                    drawHeight = minSide;
                } else {
                    drawWidth = minSide;
                    drawHeight = maxSide;
                }
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = width = drawWidth;
            canvas.height = height = drawHeight;
            // 判断图片方向，重置 canvas 大小，确定旋转角度，iphone 默认的是 home 键在右方的横屏拍摄方式
            switch (1) {
                // 1 不需要旋转
                case 1: {
                    ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    break;
                }
                // iphone 横屏拍摄，此时 home 键在左侧 旋转180度
                case 3: {
                    ctx.clearRect(0, 0, width, height);
                    ctx.translate(0, 0);
                    ctx.rotate(Math.PI);
                    ctx.drawImage(img, -width, -height, width, height);
                    break;
                }
                // iphone 竖屏拍摄，此时 home 键在下方(正常拿手机的方向) 旋转90度
                case 6: {
                    canvas.width = height;
                    canvas.height = width;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.translate(0, 0);
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.drawImage(img, 0, -height, width, height);
                    break;
                }
                // iphone 竖屏拍摄，此时 home 键在上方 旋转270度
                case 8: {
                    canvas.width = height;
                    canvas.height = width;
                    ctx.clearRect(0, 0, width, height);
                    ctx.translate(0, 0);
                    ctx.rotate(-90 * Math.PI / 180);
                    ctx.drawImage(img, -width, 0, width, height);
                    break;
                }
                default: {
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    break;
                }
            }

            let compressedDataUrl;

            if (compress && file.length > imgCompassMaxSize) {
                compressedDataUrl = canvas.toDataURL(file.type, (compressionRatio / 100));
            } else {
                compressedDataUrl = canvas.toDataURL(file.type, 1);
            }
            cabin.info("compress  end" + JSON.stringify(compressedDataUrl))

            callback(compressedDataUrl);
            // return compressedDataUrl;
        }

        img.src = data;
    }

    handleRecognize() {
        if (this.state.backIdImageBase64Data === '') {
            Toast.fail("请上传身份证国徽面");
            return;
        }

        if (this.state.faceIdImageBase64Data === '') {
            Toast.fail("请上传身份证头像面");
            return;
        }

        Toast.loading('识别中，请稍等...', 0, () => {
            //cabin.info('Load complete !!!');
        });

        const backData =
            {
                "configure": "{\"side\":\"back\"}",
                "image": this.state.backIdImageBase64Data.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', '').replace('data:image/jpg;base64,', ''),
            };


        this.recognizeID(backData).catch(async (err) => {
            if ('Error: BAD REQUEST' === err.toString()) {
                Toast.hide();
                Toast.fail("识别失败，请确认是否上传正确")
                return;
            }
            const recognizeInfo = JSON.parse(err.text);
            cabin.info(JSON.stringify(recognizeInfo));
            //识别成功
            if (recognizeInfo !== undefined) {
                if (recognizeInfo.success) {//识别成功
                    const faceData =
                        {
                            "configure": "{\"side\":\"face\"}",
                            "image": this.state.faceIdImageBase64Data.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', ''),
                        };
                    this.recognizeID(faceData).catch(async (err2) => {
                        cabin.info(JSON.stringify(err2.text));
                        const recognizeInfo2 = JSON.parse(err2.text);
                        cabin.info(JSON.stringify(recognizeInfo2));
                        if (recognizeInfo2 !== undefined) {
                            if (recognizeInfo2.success) {//识别成功
                                const idInfos =
                                    {
                                        "idNumber": recognizeInfo2.num,
                                        "name": recognizeInfo2.name,
                                        "sex": recognizeInfo2.sex,
                                        "address": recognizeInfo2.address,
                                        "birthday": recognizeInfo2.birth,
                                        "idCardStartDate": recognizeInfo.start_date,
                                        "idCardEndDate": recognizeInfo.end_date,
                                    }

                                const res = await ajax.certificationUser(idInfos);
                                if (res !== undefined && res.code === 10000) {
                                    Toast.hide();
                                    Toast.info("识别成功");
                                    this.setState({
                                        faceRecognized: true,
                                        backRecognized: true,
                                    })
                                } else {
                                    Toast.hide();
                                    Toast.fail("识别失败")
                                }
                            } else {//识别失败
                                Toast.hide();
                                Toast.info("身份证头像面识别失败");
                            }
                        } else {//识别失败
                            Toast.hide();
                            Toast.info("身份证头像面识别失败");
                        }
                    });
                } else {//识别失败
                    Toast.hide();
                    Toast.info("身份证国徽面识别失败");
                }
            } else {//识别失败
                Toast.hide();
                Toast.info("身份证国徽面识别失败");
            }
        });
    }

    async recognizeID(data) {
        const res = await ajax.recognizeID(data);
        cabin.info("recognizeID res = " + JSON.stringify(res));
    }

    onFaceIDImagesChange(event) {
        this.onIDImagesChange(event, 'face');
    }

    onBackIDImagesChange(event) {
        this.onIDImagesChange(event, 'back');
    }

    transformFileToDataUrl(file) {
        /**
         * 图片上传流程的第一步
         * @param data file文件
         */

        return new Promise((resolve, reject) => {
            let orientation;

            // 封装好的函数
            const reader = new FileReader();

            // ⚠️ 这是个回调过程 不是同步的
            reader.onload = function (e) {
                const result = e.target.result;

                EXIF.getData(file, function () {
                    EXIF.getAllTags(this);
                    orientation = EXIF.getTag(this, 'Orientation');
                    resolve(result, orientation);
                });

            };

            reader.readAsDataURL(file);
        });
    }

    onIDImagesChange(event, side) {
        const selectedFiles = Array.prototype.slice.call(event.target.files).map((item) => (item));
        cabin.info(JSON.stringify(selectedFiles))
        let imgPass = {typeError: false, sizeError: false};

        // 循环遍历检查图片 类型、尺寸检查
        selectedFiles.map((item) => {
            // 图片类型检查
            if (typeArray.indexOf(item.type.split('/')[1]) === -1) {
                imgPass.typeError = true;
            }
            // 图片尺寸检查
            if (item.size > maxSize * 1024) {
                imgPass.sizeError = true;
            } else {
                if (item.size > compressMaxSize) {
                    this.setState({
                        needCompress: true,
                    })
                }
            }
        });

        // 有错误跳出
        if (imgPass.typeError) {
            Toast.fail('不支持文件类型');
            switch (side) {
                case 'face':
                    this.refs.uploadFace.value = null;
                    break
                case 'back':
                    this.refs.uploadBack.value = null;
                    break
                default:
                    break
            }
            return;
        }

        if (imgPass.sizeError) {
            Toast.fail('文件大小超过限制');
            switch (side) {
                case 'face':
                    this.refs.uploadFace.value = null;
                    break
                case 'back':
                    this.refs.uploadBack.value = null;
                    break
                default:
                    break
            }
            return;
        }

        const image = selectedFiles[0];


        if (image === undefined && image === '') {
            return;
        }

        let vUploadImageKey = '';
        let vUploadImageFlagKey = '';

        switch (side) {
            case 'face':
                vUploadImageFlagKey = 'faceImageLoaded';
                vUploadImageKey = 'faceIdImageBase64Data';
                break
            case 'back':
                vUploadImageFlagKey = 'backImageLoaded';
                vUploadImageKey = 'backIdImageBase64Data';
                break
            default:
                break
        }

        this.transformFileToDataUrl(image)
            .then((data) => {
                cabin.info("transformFileToDataUrl：" + data)
                this.compress(data, image, (newData) => {
                    this.setState({
                        [vUploadImageKey]: newData,
                        // [vUploadImageKey]: data,
                        [vUploadImageFlagKey]: true,
                    })
                })
            });
    }


    async bookProduct() {
        const res = await ajax.bookProduct(productCode, saleId, this.state.bookCount);
        cabin.info("bookProduct res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res !== undefined && res.code != undefined) {
            if (res.code === 10000) {
                this.setState({
                    bookSale: true,
                }, () => {
                    this.showPage('toAttentionProductDetail')
                })
            } else {
                Toast.fail("请求出错");
            }
        } else {
            Toast.fail("请求出错");
        }
    }

    async tryToAttentionProductDetail() {
        const res = await ajax.getProductBookStatus(productCode, saleId);
        cabin.info("tryToAttentionProductDetail res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res !== undefined && res.code === 10000) {
            this.setState({
                bookSale: res.result.booked,
            }, () => {
                this.showPage('toAttentionProductDetail')
            });
        } else {
            Toast.info("请求出错");
        }
    }

    async tryToAttentionProductList() {
        const res = await ajax.getProductDetail(productCode, saleId);
        cabin.info("tryToAttentionProductList res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res !== undefined && res.code === 10000) {
            this.setState({
                attentionSale: res.result.attention,
                totalBookedCount: res.result.bookedCount,
            }, () => {
                this.showPage('toAttentionProductList')
            })
        } else {
            Toast.fail("请求失败");
        }
    }

    async tryToBookProductList() {
        const res = await ajax.getProductBookStatus(productCode, saleId);
        cabin.info("tryToBookProductList res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res !== undefined && res.code === 10000) {
            this.setState({
                bookSale: res.result.booked,
                myBookedCount: res.result.bookCount,
                bookTime: res.result.bookTime,
                startSaleTime: res.result.startSaleTime,
            }, () => {
                this.showPage('toBookedProductList')
            })
        } else {
            Toast.fail("请求失败");
        }

    }

    /**
     * 验证邀请码
     * @returns {Promise<void>}
     */
    async verifyInvitationCode() {
        const {invitationCode} = this.state;
        if (invitationCode != undefined && '' !== invitationCode) {
            const res = await ajax.verifyInvitationCode(productCode, saleId, invitationCode);
            cabin.info("verifyInvitationCode res = " + JSON.stringify(res));
            this.previewResponse(res);
            if (res !== undefined && res.code === 10000) {
                if (typeof window !== undefined) {
                    window.location.href = "./product_info.html?p_id=1";
                } else {
                    Toast.info("系统异常")
                }
            } else {
                this.setState({
                    verityInvitationCodeCorrect: false
                })
            }
        } else {
            Toast.info("验证码不能为空")
        }
    }

    /**
     * 邀请码输入改变监听
     * @param newCode
     */
    onInvitationCodeChange(e) {
        this.setState({
            invitationCode: e.target.value,
        })
    }

    /**
     * 预定数量输入改变监听
     * @param val
     */
    onBookCountChange(val) {
        this.setState({
            bookCount: val,
        })

    }

    /**
     * 判断是否已实名认证
     * @returns {Promise<void>}
     */
    async checkUserCertificationStatus() {
        cabin.info("checkUserCertificationStatus")
        const res = await ajax.getUserCertification();
        cabin.info("checkUserCertificationStatus res = " + JSON.stringify(res));
        this.previewResponse(res);
        let vUserCertification = false;
        if (res !== undefined && res.code === 10000 && res.result.userCertification) {
            vUserCertification = true;
        }
        this.setState({
            userCertification: vUserCertification,
        })
    }

    /**
     * 跳转至产品详细
     * @returns {Promise<void>}
     */
    async toProjectDetail() {
        cabin.info("toProjectDetail")
        const res = await ajax.getProductDetail(productCode, saleId);
        cabin.info("getProductDetail res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res.code !== undefined && res.code === 11003) {
            this.setState({
                invitationCodeModal: true,
            })
        } else {
            if (typeof window !== undefined) {
                window.location.href = "./product_info.html?p_id=1";
            }
        }
    }


    /**
     * 验证码发送倒计时
     */
    tick() {
        if (this.state.secondsElapsed > 0) {
            this.setState((prevState) => ({
                secondsElapsed: prevState.secondsElapsed - 1
            }));
            if (!this.interval) {
                this.interval = setInterval(() => this.tick(), 1000);
            }
        } else {
            clearInterval(this.interval);
            this.interval = null;
            this.setState((prevState) => ({
                secondsElapsed: smsRequestInterval
            }));
        }
    }

    /**
     * 获取验证码
     * @returns {Promise<void>}
     */
    async getSmsCode() {
        //判断手机号是否合法
        if (ValidateMobile(Trim(this.state.phone, 'g'))) {
            const res = await ajax.getSmsCode(this.state.phone);
            this.previewResponse(res);
            cabin.info("getSmsCode res = " + JSON.stringify(res));
            if (res.code !== undefined && res.code === 10000) {
                this.tick()
            } else {
                Toast.info("获取验证码失败")
            }
        }
    }

    /**
     * 页面跳转
     * @param page
     */
    showPage(page) {
        let vToHome = false;
        let vToMine = false;
        let vToLogin = false;
        let vToAttentionProductList = false;
        let vToBookedProductList = false;
        let vToUserCertification = false;
        let vToAttentionProductDetail = false;
        let vToBookedProductDetail = false;

        switch (page) {
            case 'toHome':
                vToHome = true;
                break;
            case 'toMine':
                vToMine = true;
                break;
            case 'toLogin':
                vToLogin = true;
                break;
            case 'toAttentionProductList':
                vToAttentionProductList = true;
                break;
            case 'toBookedProductList':
                vToBookedProductList = true;
                break;
            case 'toUserCertification':
                vToUserCertification = true;
                break;
            case 'toAttentionProductDetail':
                vToAttentionProductDetail = true;
                break;
            case 'toBookedProductDetail':
                vToBookedProductDetail = true;
                break;
            default:
                break;
        }

        this.setState({
            toMine: vToMine,
            toHome: vToHome,
            toLogin: vToLogin,
            toAttentionProductList: vToAttentionProductList,
            toBookedProductList: vToBookedProductList,
            toUserCertification: vToUserCertification,
            toAttentionProductDetail: vToAttentionProductDetail,
            toBookedProductDetail: vToBookedProductDetail,
        })
    }

    /**
     * 显示或者关闭验证码输入界面
     * @param isShow
     */
    showOrCloseCodeInputView(isShow) {
        this.setState({
            showCode: isShow,
        }, () => {
            if (isShow) {
                setTimeout(() => {
                    this.getSmsCode();
                }, 500);
            }
        })
    }

    /**
     * 尝试绑定微信openId
     * @returns {Promise<void>}
     */
    async tryToBindOpenId() {
        const param = {"vCode": this.state.smsCode, "phoneNumber": this.state.phone};
        const res = await ajax.bindWechat(param);
        cabin.info("tryToBindOpenId res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res !== undefined) {
            if (res.code === 10000) {
                this.showPage('toMine')
            } else if (res.code === 10015) {
                Toast.info("请重新获取短信验证码")
            }
        } else {
            Toast.info("登录失败")
        }
    }

    async configWechatJSSDK() {
        // const url = urlencode(window.location.href.split('#')[0]);
        const url = window.location.href.split('#')[0];
        cabin.info(url)
        const res = await ajax.getWXConfigInfo(url);
        cabin.info(JSON.stringify(res))
        this.previewResponse(res);
        if (res !== undefined && res.code !== undefined && res.code === 10000) {
            wx.config({
                debug: false,
                appId: res.result.appId,
                timestamp: res.result.timestamp,
                nonceStr: res.result.nonceStr,
                signature: res.result.signature,
                jsApiList: [
                    // 'updateTimelineShareData',
                    // 'updateAppMessageShareData',
                    'hideMenuItems',
                ]
            });

            wx.ready(function () {
                wx.hideMenuItems({
                    menuList: ["menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                });
            });

            wx.error(function (res) {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。-->
                cabin.info("wx error " + JSON.stringify(res));
            });
        } else {
            Toast.info("获取微信配置失败")
        }
    }

    componentWillUnMount() {
        clearInterval(this.interval);
        this.interval = null;
    }

    componentDidMount() {

        this.configWechatJSSDK();

        if (nav_to !== undefined && nav_to !== '') {
            switch (nav_to) {
                case 'login':
                    this.showPage('toLogin');
                    break;
                case 'mine':
                    this.showPage('toMine');
                    break;
                default:
                    break
            }
        }
    }

    onModalClose(key) {
        this.setState({
            [key]: false,
        });
    }

    onWrapTouchStart(e) {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    render() {

        const onFaceUploadPress = () => {
            if (this.state.backRecognized && this.state.faceRecognized) {
                return;
            }
            this.refs.uploadFace.click()
        };
        const onBackUploadPress = () => {
            if (this.state.backRecognized && this.state.faceRecognized) {
                return;
            }
            this.refs.uploadBack.click()
        };

        return (
            <div style={{width: '100%'}}>
                <div style={this.state.toHome ? {width: '100%'} : {display: 'none'}}>
                    <NavBar
                        rightContent={[
                            <img key={1} style={{width: '15px', height: '15px'}} src={IconMine}
                                 alt={""} onClick={() => {
                                this.showPage("toMine");
                                this.checkUserCertificationStatus();
                            }}/>
                        ]}
                    >大衍金融</NavBar>
                    <div className="content">
                        <ProductItem project="江苏无锡政府债转股项目" location="江苏·无锡" bgTop={require('./images/bg-top-wx.png')}
                                     toProjectDetail={this.toProjectDetail}/>
                        <ProductItem project="浙江温州政府债转股项目" location="浙江·温州" bgTop={require('./images/bg-top-wz.png')}
                                     toProjectDetail={() => {
                                         Toast.info("即将开放预约", 1)
                                     }}/>
                        <ProductItem project="四川成都政府债转股项目" location="四川·成都" bgTop={require('./images/bg-top-cd.png')}
                                     toProjectDetail={() => {
                                         Toast.info("即将开放预约", 1)
                                     }}/>
                        <ProductItem project="陕西西安政府债转股项目" location="陕西·西安" bgTop={require('./images/bg-top-xa.png')}
                                     toProjectDetail={() => {
                                         Toast.info("即将开放预约", 1)
                                     }}/>
                        <ProductItem project="广东深圳政府债转股项目" location="广东·深圳" bgTop={require('./images/bg-top-sz.png')}
                                     toProjectDetail={() => {
                                         Toast.info("即将开放预约", 1)
                                     }}/>
                        <ProductItem project="浙江杭州政府债转股项目" location="浙江·杭州" bgTop={require('./images/bg-top-hz.png')}
                                     toProjectDetail={() => {
                                         Toast.info("即将开放预约", 1)
                                     }}/>


                        <div style={{
                            backgroundColor: '#ffffff',
                            marginTop: '10px',
                            padding: '35px 25px 35px 25px',
                            marginBottom: '20px'
                        }}>
                            <Flex>
                                <Flex.Item style={{flex: 1, textAlign: 'right'}}>
                                    <img style={{width: '25px', height: '25px'}}
                                         src={require('./images/icon-safe.png')}/>
                                </Flex.Item>
                                <Flex.Item style={{flex: 9}}>
                                    <div style={{fontSize: '1.2em', fontWeight: 'bold'}}> 更安全</div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace/>
                            <Flex>
                                <Flex.Item style={{flex: 1}}>

                                </Flex.Item>
                                <Flex.Item style={{flex: 9, fontSize: '0.8em', color: '#7A7A7A', lineHeight: '1.5em'}}>
                                    作为分布式记账平台的核心技术，区块链系统
                                    利用了分布式系统、密码学、博弈论、网络协
                                    议等，提供更加安全的财富服务。从唯一性、
                                    密码、身份验证、传输等方面层层把关，让整
                                    个理财过程让人放心。
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace/>
                            <WhiteSpace/>
                            <Flex>
                                <Flex.Item style={{flex: 1, textAlign: 'right'}}>
                                    <img style={{width: '25px', height: '25px'}}
                                         src={require('./images/icon-lucency.png')}/>
                                </Flex.Item>
                                <Flex.Item style={{flex: 9}}>
                                    <div style={{fontSize: '1.2em', fontWeight: 'bold'}}> 更透明</div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace/>
                            <Flex>
                                <Flex.Item style={{flex: 1}}>

                                </Flex.Item>
                                <Flex.Item style={{flex: 9, fontSize: '0.8em', color: '#7A7A7A', lineHeight: '1.5em'}}>
                                    去中心化是平台的技术特色。多节点的网络副
                                    本提供给所有用户更加放心的透明体验，除此
                                    之外，不同地理位置、不同服务商以及不同利
                                    益体的部署方式让数据丢失风险降低到最低。
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace/>
                            <WhiteSpace/>
                            <Flex>
                                <Flex.Item style={{flex: 1, textAlign: 'right'}}>
                                    <img style={{width: '25px', height: '25px'}}
                                         src={require('./images/icon-better.png')}/>
                                </Flex.Item>
                                <Flex.Item style={{flex: 9}}>
                                    <div style={{fontSize: '1.2em', fontWeight: 'bold'}}> 更优质</div>
                                </Flex.Item>
                            </Flex>
                            <WhiteSpace/>
                            <Flex>
                                <Flex.Item style={{flex: 1}}>

                                </Flex.Item>
                                <Flex.Item style={{flex: 9, fontSize: '0.8em', color: '#7A7A7A', lineHeight: '1.5em'}}>
                                    平台与多家优质合规资质单位合作，为用户提
                                    供更多的金融产品信息。尤其是，平台率先推
                                    出地方政府债转股项目，优质、稳定、收益高，
                                    是时代理财的趋势。
                                </Flex.Item>
                            </Flex>
                        </div>
                    </div>
                </div>

                <div style={this.state.toMine ? {width: '100%'} : {display: 'none'}}>

                    <div style={{backgroundColor: "#353EA4", minHeight: '125px'}}>
                        <NavBar
                            leftContent="首页"
                            icon={<Icon type="left"/>}
                            onLeftClick={() => {
                                this.showPage('toHome')
                            }}
                        >我</NavBar>

                        <Flex>
                            <Flex.Item style={{flex: 1, textAlign: 'end'}}>
                                <img style={{width: '40px', height: '40px'}} src={head}
                                     alt={""}/>
                            </Flex.Item>
                            <Flex.Item style={{flex: 5}}>
                                <div>
                                    <div className="level-tag">LV.1</div>
                                    <WhiteSpace/>
                                    <div style={{
                                        fontSize: '12px',
                                        width: '100%',
                                        textAlign: 'end',
                                        color: '#8F96D7',
                                        marginTop: '8px'
                                    }}>0/9999
                                    </div>
                                    <Progress percent={0} position="normal" unfilled={true}
                                              appearTransition
                                              style={{
                                                  backgroundColor: '#252B5C',
                                                  borderRadius: '5px 5px 5px 5px'
                                              }}
                                              barStyle={{
                                                  border: '4px solid #7B84DD',
                                                  borderRadius: '5px 0px 0px 5px'
                                              }}/>
                                </div>
                            </Flex.Item>
                            <WingBlank/>
                        </Flex>

                    </div>

                    <WhiteSpace/>

                    <List className="my-list">
                        <Item
                            arrow={this.state.userCertification ? 'none' : "horizontal"}
                            thumb={IconRealName}
                            onClick={() => {
                                if (!this.state.userCertification) {
                                    this.showPage('toUserCertification')
                                }
                            }}
                        >
                            实名认证 <div style={{
                            fontSize: '13px',
                            marginLeft: '5px',
                            color: '#512fff',
                            display: 'inline'
                        }}>{this.state.userCertification ? "(已通过)" : ''}</div>
                        </Item>
                        <Item
                            arrow="horizontal"
                            thumb={IconAttention}
                            onClick={() => {
                                this.tryToAttentionProductList();
                            }}
                        >
                            我关注的产品
                        </Item>
                        <Item
                            arrow="horizontal"
                            thumb={IconBook}
                            onClick={() => {
                                this.tryToBookProductList();
                            }}
                        >
                            我预约的产品
                        </Item>
                        {/*<Item*/}
                        {/*arrow="horizontal"*/}
                        {/*thumb={IconLogout}*/}
                        {/*onClick={() => {*/}
                        {/*}}*/}
                        {/*>*/}
                        {/*退出登录*/}
                        {/*</Item>*/}
                    </List>
                </div>

                <div style={this.state.toLogin ? {
                    width: '100%',
                    textAlign: 'center',
                } : {display: 'none'}}>
                    <NavBar
                        icon={<Icon type="left"/>}
                        onLeftClick=
                            {
                                () => {
                                    if (!this.state.showCode) {
                                        this.showPage('toHome');
                                    } else {
                                        this.showOrCloseCodeInputView(false);
                                    }
                                }
                            }
                    >大衍金融</NavBar>

                    <div style={this.state.showCode ? {display: 'none'} : {
                        width: '100%', marginTop: '100px'
                    }}>
                        <CodeBox
                            type="tel"
                            length={11}
                            validator={(input, index) => {
                                return /\d/.test(input);
                            }}
                            onChange={codeArray => {
                                const phone = codeArray.join('');
                                cabin.info(phone);
                                this.setState({
                                    phoneIsCorrect: ValidateMobile(phone),
                                    phone: phone,
                                })
                            }}
                        />

                        <p style={{marginTop: '10px', marginBottom: '80px'}}>请填写手机号</p>

                        <input type="button" className="invitationCodeButton" value="下一步"
                               disabled={this.state.phoneIsCorrect ? '' : 'disabled'} onClick={() => {
                            this.showOrCloseCodeInputView(true);
                        }}/>

                    </div>

                    <div style={this.state.showCode ? {textAlign: 'center', marginTop: '100px'} : {display: 'none'}}>
                        <CodeBox
                            type="tel"
                            length={6}
                            validator={(input, index) => {
                                return /\d/.test(input);
                            }}
                            onChange={codeArray => {
                                const smsCode = Array.prototype.join.call(codeArray, '')
                                cabin.info(smsCode);
                                let isSmsCodeCorrect = false;
                                if (smsCode != undefined && smsCode !== '' && (smsCode.length === 6)) {
                                    isSmsCodeCorrect = true;
                                }

                                this.setState({
                                    smsCode: smsCode,
                                    smsCodeIsCorrect: isSmsCodeCorrect,
                                })
                            }}
                        />
                        <p style={{marginTop: '10px', marginBottom: '10px'}}>请填写验证码</p>

                        <p onClick={this.getSmsCode}>{this.state.secondsElapsed === smsRequestInterval ? "重新发送" : "剩余" + this.state.secondsElapsed + "秒"}</p>

                        <input
                            type="button"
                            className="invitationCodeButton"
                            value="登录"
                            disabled={this.state.smsCodeIsCorrect ? '' : 'disabled'}
                            style={{marginBottom: '80px'}}
                            onClick={() => {
                                this.tryToBindOpenId();
                            }}/>
                    </div>
                </div>

                <div style={this.state.toUserCertification ? {width: '100%'} : {display: 'none'}}>
                    <div className="title">
                        <NavBar
                            leftContent="我"
                            icon={<Icon type="left"/>}
                            onLeftClick={() => {
                                this.showPage('toMine')
                                this.checkUserCertificationStatus();
                            }}
                        >实名认证</NavBar>
                    </div>

                    <div className="content" style={{textAlign: 'center'}}>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <div style={{
                            textAlign: 'left',
                            fontSize: '12px',
                            marginBottom: '10px',
                            marginLeft: '10%'
                        }}>身份证头像面：
                        </div>
                        <img style={{width: '80%', height: '200px', backgroundColor: 'transparent'}}
                             src={this.state.faceImageLoaded ? this.state.faceIdImageBase64Data : BgUploadId} alt=""
                             onClick={onFaceUploadPress}/>
                        <WhiteSpace/>
                        <input type="button" className="reloadIdImageButton" value="重新上传"
                               style={(!this.state.faceImageLoaded || (this.state.backRecognized && this.state.faceRecognized)) ? {display: 'none'} : {}}
                               onClick={onFaceUploadPress}/>
                        <WhiteSpace/>
                        <div style={{
                            textAlign: 'left',
                            fontSize: '12px',
                            marginBottom: '10px',
                            marginLeft: '10%'
                        }}>身份证国徽面：
                        </div>
                        <img style={{width: '80%', height: '200px'}}
                             src={this.state.backImageLoaded ? this.state.backIdImageBase64Data : BgUploadId} alt=""
                             onClick={onBackUploadPress}/>
                        <WhiteSpace/>
                        <input type="button" className="reloadIdImageButton" value="重新上传"
                               style={(!this.state.backImageLoaded || (this.state.backRecognized && this.state.faceRecognized)) ? {display: 'none'} : {}}
                               onClick={onBackUploadPress}/>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <WhiteSpace/>
                        <input ref="uploadFace" type="file" accept="image/*" style={{display: 'none'}}
                               onChange={this.onFaceIDImagesChange}/>
                        <input ref="uploadBack" type="file" accept="image/*" style={{display: 'none'}}
                               onChange={this.onBackIDImagesChange}/>
                    </div>


                    {/*<ImagePicker*/}
                    {/*key={0}*/}
                    {/*files={this.state.faceIdImages}*/}
                    {/*onChange={this.onFaceIDImagesChange}*/}
                    {/*selectable={this.state.faceIdImages.length < 2 && !this.state.faceRecognized}*/}
                    {/*length={2}*/}
                    {/*/>*/}

                    {/*/!*<input type="file" accept=".png, .jpg, .jpeg" />*!/*/}

                    {/*<ImagePicker*/}
                    {/*key={1}*/}
                    {/*files={this.state.backIdImages}*/}
                    {/*onChange={this.onBackIDImagesChange}*/}
                    {/*selectable={this.state.backIdImages.length < 2 && !this.state.backRecognized}*/}
                    {/*length={2}*/}
                    {/*/>*/}

                    <div className="footer"
                         style={(this.state.backRecognized && this.state.faceRecognized) ? {display: 'none'} : {}}>
                        <div className="footer-button" onClick={() => {
                            this.handleRecognize()
                        }}>认证
                        </div>
                    </div>
                </div>

                <div style={this.state.toAttentionProductList ? {width: '100%'} : {display: 'none'}}>
                    <NavBar
                        leftContent="我"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.showPage('toMine')
                        }}
                    >我关注的产品</NavBar>
                    <div style={this.state.attentionSale ? {
                        width: '100%',
                        marginTop: '15px',
                        paddingBottom: '10px'
                    } : {display: 'none'}}>
                        <WhiteSpace/>
                        <div className="product-card-container" onClick={() => {
                            this.tryToAttentionProductDetail();
                        }}>
                            <img src={BgProductItem} alt=""
                                 style={{
                                     width: '100%'
                                 }}/>
                            <div className="product-card-body">
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        paddingLeft: '10px',
                                        paddingTop: '5px'
                                    }}>
                                        <div style={{flex: 3}}><span
                                            style={{fontSize: '1.2em', fontWeight: 'bold'}}>太平洋东星债转股优先级计划4号</span>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div className="product-status-tag">火爆预约中</div>
                                        </div>
                                    </div>
                                    <Flex style={{fontSize: '12px', marginTop: '6px'}}>
                                        <Flex.Item style={{flex: 1, textAlign: 'center'}}>
                                            <img style={{width: '10px', height: 'auto'}} src={IconLocation} alt=""/>
                                        </Flex.Item>
                                        <Flex.Item style={{flex: 3, textAlign: 'left', marginLeft: '-8px'}}>
                                            <span>江苏·无锡</span>
                                        </Flex.Item>
                                        <Flex.Item style={{flex: 4}}>
                                            <span>募集金额 600万</span>
                                        </Flex.Item>
                                        <Flex.Item style={{flex: 1, textAlign: 'center'}}>
                                            <img style={{width: '13px', height: 'auto'}} src={IconLogo} alt=""/>
                                        </Flex.Item>
                                        <Flex.Item style={{flex: 2, textAlign: 'left', marginLeft: '-8px'}}>
                                            <span>大衍资本</span>
                                        </Flex.Item>
                                    </Flex>
                                    <div style={{
                                        display: 'flex',
                                        paddingLeft: '10px',
                                        paddingTop: '5px',
                                        textAlign: 'center'
                                    }}>
                                        <Progress percent={(this.state.totalBookedCount / totalCount).toFixed(4) * 100}
                                                  position="normal" unfilled={true}
                                                  appearTransition
                                                  style={{
                                                      backgroundColor: '#2F3F75',
                                                      borderRadius: '5px 5px 5px 5px',
                                                      flex: 4,
                                                      height: '9px',
                                                      marginTop: '3px',
                                                  }}
                                                  barStyle={{
                                                      border: '4px solid #FCB53F',
                                                      borderRadius: '5px 0px 0px 5px'
                                                  }}/>
                                        <div style={{
                                            flex: 1,
                                        }}><span>{(this.state.totalBookedCount / totalCount).toFixed(4) * 100}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={this.state.toBookedProductList ? {width: '100%'} : {display: 'none'}}>
                    <NavBar
                        leftContent="我"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.showPage('toMine')
                        }}
                    >我预约的产品</NavBar>
                    <div style={this.state.bookSale ? {
                        width: '100%',
                        marginTop: '15px',
                        paddingBottom: '10px'
                    } : {display: 'none'}}>
                        <WhiteSpace/>
                        <div className="product-card-container" onClick={this.props.toProjectDetail}>
                            <img src={BgProductItem} alt=""
                                 style={{
                                     width: '100%'
                                 }}/>
                            <div className="product-card-body" style={{fontSize: '12px', padding: '0px'}}>
                                <div style={{
                                    paddingLeft: '10px',
                                    paddingTop: '15px'
                                }}>
                                    <span style={{fontSize: '1.2em', fontWeight: 'bold'}}>太平洋东星债转股优先级计划4号</span>
                                </div>
                                <div style={{
                                    left: '10px',
                                    right: '10px',
                                    fontWeight: 'lighter',
                                    position: 'absolute',
                                    bottom: '15px',
                                }}>
                                    <div style={{marginBottom: '5px'}}><span>预约时间 {this.state.bookTime}</span></div>
                                    <Flex>
                                        <Flex.Item><span>预约认筹金额 {this.state.myBookedCount * eachCountFigure}</span></Flex.Item>
                                        <Flex.Item
                                            style={{textAlign: 'right'}}>
                                            <span>
                                                开放认筹时间 {this.state.startSaleTime}
                                                </span>
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={this.state.toAttentionProductDetail ? {width: '100%'} : {display: 'none'}}>
                    <NavBar
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.showPage('toAttentionProductList')
                        }}
                    >关注的产品详情</NavBar>
                    <img style={{width: '100%'}} src={ImageProductDetail01} alt=""/>
                    <div style={{backgroundColor: '#ffffff'}}>
                        <WhiteSpace/>
                        <WingBlank>
                            <div style={{display: 'flex'}}>
                                <div style={{flex: '4', fontWeight: 'bold', fontSize: '14px', marginRight: '5px'}}>
                                    太平洋东星债转股优先级计划4号
                                </div>
                                <div style={{flex: '1'}}>
                                    <div className="status-tag-detail">火爆预约中</div>
                                </div>
                            </div>

                            <WhiteSpace/>

                            <div>
                                <img style={{width: '10px', lineHeight: 'auto', textAlign: 'center', height: 'auto'}}
                                     src={IconLocationBlack} alt=""/>
                                <div style={{
                                    fontSize: '12px',
                                    lineHeight: 'auto',
                                    height: 'auto',
                                    display: 'inline',
                                    marginLeft: '5px'
                                }}>江苏·无锡 募集金额 600万
                                </div>
                            </div>
                            <WhiteSpace/>
                            <Flex>
                                <Flex.Item style={{flex: 9}}>
                                    <Progress percent={(this.state.totalBookedCount / totalCount).toFixed(4) * 100}
                                              position="normal" unfilled={true}
                                              appearTransition
                                              style={{
                                                  backgroundColor: '#2F3F75',
                                                  borderRadius: '5px 5px 5px 5px'
                                              }}
                                              barStyle={{
                                                  border: '4px solid #FCB53F',
                                                  borderRadius: '5px 0px 0px 5px'
                                              }}/>
                                </Flex.Item>
                                <Flex.Item style={{flex: 1}}>
                                    {(this.state.totalBookedCount / totalCount).toFixed(4) * 100}%
                                </Flex.Item>
                            </Flex>
                        </WingBlank>
                        <WhiteSpace/>
                    </div>
                    <div style={{backgroundColor: '#ffffff', marginTop: '8px'}}>
                        <WhiteSpace/>
                        <div style={{display: 'flex', paddingTop: '10px'}}>
                            <div style={{flex: 3, textAlign: 'center'}}>募资金额</div>
                            <div style={{flex: 7, float: 'left',}}>6000000</div>
                        </div>
                        <div style={{display: 'flex', paddingTop: '10px'}}>
                            <div style={{flex: 3, textAlign: 'center'}}>认筹类别</div>
                            <div style={{flex: 7, float: 'left',}}>优先股</div>
                        </div>
                        <div style={{display: 'flex', paddingTop: '10px'}}>
                            <div style={{flex: 3, textAlign: 'center'}}>存续期限</div>
                            <div style={{flex: 7, float: 'left',}}>30天</div>
                        </div>
                        <div style={{display: 'flex', paddingTop: '10px'}}>
                            <div style={{flex: 3, textAlign: 'center'}}>锁期时间</div>
                            <div style={{flex: 7, float: 'left',}}>30天</div>
                        </div>
                        <div style={{display: 'flex', paddingTop: '10px'}}>
                            <div style={{flex: 3, textAlign: 'center'}}>收益介绍</div>
                            <div style={{flex: 7, float: 'left',}}>
                                年化18.23%<br/>
                                (基础分红6% + 协议分红12.23%)
                            </div>
                        </div>
                        <div style={{display: 'flex', paddingTop: '10px'}}>
                            <div style={{flex: 3, textAlign: 'center'}}>收益发放</div>
                            <div style={{flex: 7, float: 'left',}}>到期付</div>
                        </div>
                        <div style={{display: 'flex', paddingTop: '10px'}}>
                            <div style={{flex: 3, textAlign: 'center'}}>违约相关</div>
                            <div style={{flex: 7, float: 'left',}}>本产品不可提前赎回</div>
                        </div>
                        <WhiteSpace/>
                        <WhiteSpace/>
                    </div>
                    <div className="footer-button" onClick={() => {
                        this.showPage('toBookedProductDetail')
                    }} style={this.state.bookSale ? {display: 'none'} : {}}>立即预约
                    </div>
                </div>

                <div style={this.state.toBookedProductDetail ? {width: '100%'} : {display: 'none'}}>
                    <NavBar
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.showPage('toAttentionProductDetail')
                        }}
                    >预约产品</NavBar>
                    <img style={{width: '100%'}} src={ImageProductDetail01} alt=""/>
                    <div style={{backgroundColor: '#ffffff'}}>
                        <WhiteSpace/>
                        <WingBlank>
                            <div style={{display: 'flex'}}>
                                <div style={{flex: '4', fontWeight: 'bold', fontSize: '14px', marginRight: '5px'}}>
                                    太平洋东星债转股优先级计划4号
                                </div>
                                <div style={{flex: '1'}}>
                                    <div className="status-tag-detail">火爆预约中</div>
                                </div>
                            </div>

                            <WhiteSpace/>

                            <div>
                                <img style={{width: '10px', lineHeight: 'auto', textAlign: 'center', height: 'auto'}}
                                     src={IconLocationBlack} alt=""/>
                                <div style={{
                                    fontSize: '12px',
                                    lineHeight: 'auto',
                                    height: 'auto',
                                    display: 'inline',
                                    marginLeft: '5px'
                                }}>江苏·无锡 募集金额 600万
                                </div>
                            </div>
                            <WhiteSpace/>
                            <Flex>
                                <Flex.Item style={{flex: 9}}>
                                    <Progress percent={(this.state.totalBookedCount / totalCount).toFixed(4) * 100}
                                              position="normal" unfilled={true}
                                              appearTransition
                                              style={{
                                                  backgroundColor: '#2F3F75',
                                                  borderRadius: '5px 5px 5px 5px'
                                              }}
                                              barStyle={{
                                                  border: '4px solid #FCB53F',
                                                  borderRadius: '5px 0px 0px 5px'
                                              }}/>
                                </Flex.Item>
                                <Flex.Item style={{flex: 1}}>
                                    {(this.state.totalBookedCount / totalCount).toFixed(4) * 100}%
                                </Flex.Item>
                            </Flex>
                        </WingBlank>
                        <WhiteSpace/>
                    </div>

                    <div style={{marginTop: '10px', backgroundColor: '#ffffff'}}>
                        <WhiteSpace/>
                        <WingBlank>
                            <div style={{fontSize: '16px'}}>¥20000
                                <div style={{display: 'inline', fontSize: '12px'}}> /份</div>
                            </div>
                            <div style={{fontSize: '12px', marginTop: '3px', color: '#9c9c9c'}}>1份起约，每位用户最多只能预约150份
                            </div>
                            <div style={{
                                width: '100%',
                                height: '1px',
                                borderBottom: '1px',
                                borderColor: '#efefef',
                                borderBottomStyle: 'solid',
                                marginTop: '5px'
                            }}/>
                            <div style={{height: '120px', width: '100%', textAlign: 'center', display: 'table'}}>
                                <div style={{
                                    display: 'table-cell',
                                    verticalAlign: 'middle',
                                }}>
                                    <div style={{
                                        fontWeight: 'bold',
                                        fontSize: '2.5em',
                                        lineHeight: '80%'
                                    }}>
                                        ¥{this.state.bookCount * eachCountFigure}
                                    </div>
                                    <div style={{
                                        fontSize: '12px', color: '#9c9c9c', marginTop: '10px'
                                    }}>
                                        总投入金额
                                    </div>
                                </div>
                            </div>

                            <div style={{marginTop: '-20px'}}>
                                <Flex>
                                    <Flex.Item style={{flex: 5}}>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#9c9c9c'
                                        }}>剩余数量 {300 - this.state.totalBookedCount - this.state.bookCount}</div>
                                    </Flex.Item>
                                    <Flex.Item style={{flex: 2}}>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#9c9c9c',
                                            width: '100%',
                                            textAlign: 'right'
                                        }}>预约数量
                                        </div>
                                    </Flex.Item>
                                    <Flex.Item style={{flex: 3}}>
                                        <Stepper
                                            style={{width: '100%',}}
                                            showNumber
                                            max={(this.state.totalBookedCount > 150) ? (300 - this.state.totalBookedCount - this.state.bookCount) : 150}
                                            min={1}
                                            defaultValue={1}
                                            value={this.state.bookCount}
                                            onChange={this.onBookCountChange}
                                        />
                                    </Flex.Item>
                                </Flex>
                            </div>
                        </WingBlank>
                        <WhiteSpace/>
                    </div>
                    <div className="footer-button" onClick={this.bookProduct}>确认预约</div>
                </div>

                <Modal
                    visible={this.state.invitationCodeModal}
                    transparent
                    closable={true}
                    // maskClosable={true}
                    animationType='slide-up'
                    onClose={() => {
                        this.onModalClose('invitationCodeModal')
                    }}
                    wrapProps={{onTouchStart: this.onWrapTouchStart}}
                >
                    <div style={{height: '280px', textAlign: 'center'}}>
                        <div style={{textAlign: 'center', paddingTop: '70px'}}>
                            <input className="invitationCode" onChange={this.onInvitationCodeChange}
                                   value={this.state.invitationCode}/>
                            <WhiteSpace/>
                            <span style={{
                                fontSize: '80%',
                                color: '#000000'
                            }}>{this.state.verityInvitationCodeCorrect ? '请输入邀请码' : '邀请码错误，请重新输入'}</span>
                        </div>

                        <div style={{position: 'absolute', bottom: 20, left: 0, right: 0}}>
                            <WingBlank>
                                <input type="button" className="invitationCodeButton" value="确定"
                                       onClick={this.verifyInvitationCode}/>
                                <WhiteSpace/>
                                <span style={{fontSize: '80%', color: '#000000'}}>关注公众号"大衍金融平台"获取邀请码</span>
                                <WhiteSpace/>
                            </WingBlank>
                        </div>

                    </div>
                </Modal>
            </div>

        );
    }
}

export default Home;
