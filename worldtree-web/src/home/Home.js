import React, {Component} from 'react';
import './Home.css';
import {
    Toast,
    NavBar,
    Flex,
    WingBlank,
    WhiteSpace,
    Modal
} from "antd-mobile";
import EXIF from 'exif-js'
import {Trim, ValidateMobile, GetQueryString} from "../utils";
import ajax from "../utils/ajax";
import ProductItem from "../compont/ProductItem";
import IconMine from './images/icon-mine.png'

import cabin from '../utils/Logger';

import Mine from "../page/Mine";
import UserCertification from "../page/UserCertification";
import AttentionProductList from "../page/AttentionProductList";
import BookedProductList from "../page/BookedProductList";
import AttentionProductDetail from "../page/AttentionProductDetail";
import BookedProductDetail from "../page/BookedProductDetail";
import Login from "../page/Login";

const wx = window.jWeixin || require('weixin-js-sdk')

const smsRequestInterval = 60;
const saleId = 1;
const productCode = "100010000";
const totalCount = 300;
const eachCountFigure = 20000;

const navTo = GetQueryString('nav-to')

const maxSize = 10 * 1024; // 10MB
const compressMaxSize = 2 * 1024;
const typeArray = ['jpeg', 'jpg', 'png'];

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
            toHome: true,
            toMine: false,
            toLogin: false,
            toAttentionProductList: false,
            toBookedProductList: false,
            toUserCertification: false,
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
            Toast.fail("服务器出错",1);
            return;
        } else {
            if (res.code === 10001) {
                Toast.info("请先登录",1);
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
                    window.location.href = "./product-info.html?p_id=1";
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
                window.location.href = "./product-info.html?p_id=1";
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
        cabin.info("tryToBindOpenId begin");
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
            Toast.fail("获取微信配置失败",1)
        }
    }

    componentWillUnMount() {
        clearInterval(this.interval);
        this.interval = null;
    }

    componentDidMount() {
        if (navTo !== undefined && navTo !== '') {
            switch (navTo) {
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

        this.configWechatJSSDK();
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
        return (
            <div style={{width: '100%'}}>
                {/*首页*/}
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
                {/*我的*/}
                <div style={this.state.toMine ? {width: '100%'} : {display: 'none'}}>
                    <Mine
                        userCertification={this.state.userCertification}
                        minePageBack={() => {
                            this.showPage('toHome')
                        }}
                        tryToUserCertification={() => {
                            if (!this.state.userCertification) {
                                this.showPage('toUserCertification')
                            }
                        }}
                        tryToAttentionProductList={() => {
                            this.tryToAttentionProductList()
                        }}
                        tryToBookProductList={() => {
                            this.tryToBookProductList()
                        }}
                    />
                </div>
                {/*登录*/}
                <div style={this.state.toLogin ? {
                    width: '100%',
                    textAlign: 'center',
                } : {display: 'none'}}>
                    <Login
                        showCode={this.state.showCode}
                        phoneIsCorrect={this.state.phoneIsCorrect}
                        secondsElapsed={this.state.secondsElapsed}
                        smsRequestInterval={60}
                        smsCodeIsCorrect={this.state.smsCodeIsCorrect}

                        pageBack={() => {
                            if (!this.state.showCode) {
                                this.showPage('toHome');
                            } else {
                                this.showOrCloseCodeInputView(false);
                            }
                        }}
                        onTelChange={(codeArray) => {
                            const phone = codeArray.join('');
                            cabin.info(phone);
                            this.setState({
                                phoneIsCorrect: ValidateMobile(phone),
                                phone: phone,
                            })
                        }}
                        onSmsCodeChange={(codeArray) => {
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
                        nextStep={() => {
                            this.showOrCloseCodeInputView(true);
                        }}
                        getSmsCode={() => {
                            this.getSmsCode()
                        }}
                        login={() => {
                            this.tryToBindOpenId();
                        }}
                    />
                </div>
                {/*实名认证*/}
                <div style={this.state.toUserCertification ? {width: '100%'} : {display: 'none'}}>
                    <UserCertification
                        faceImageLoaded={this.state.faceImageLoaded}
                        faceIdImageBase64Data={this.state.faceIdImageBase64Data}
                        faceRecognized={this.state.faceRecognized}
                        backImageLoaded={this.state.backImageLoaded}
                        backIdImageBase64Data={this.state.backIdImageBase64Data}
                        backRecognized={this.state.backRecognized}

                        userCertificationPageBack={() => {
                            this.showPage('toMine')
                            this.checkUserCertificationStatus();
                        }}
                        onFaceIDImagesChange={this.onFaceIDImagesChange}
                        onBackIDImagesChange={this.onBackIDImagesChange}
                        handleRecognize={this.handleRecognize}
                    />
                </div>
                {/*关注列表*/}
                <div style={this.state.toAttentionProductList ? {width: '100%'} : {display: 'none'}}>
                    <AttentionProductList
                        attentionSale={this.state.attentionSale}
                        totalBookedCount={this.state.totalBookedCount}
                        totalCount={totalCount}

                        pageBack={() => {
                            this.showPage('toMine')
                        }}
                        tryToAttentionProductDetail={() => {
                            this.tryToAttentionProductDetail();
                        }}
                    />
                </div>
                {/*预约列表*/}
                <div style={this.state.toBookedProductList ? {width: '100%'} : {display: 'none'}}>
                    <BookedProductList
                        bookSale={this.state.bookSale}
                        myBookedCount={this.state.myBookedCount}
                        bookTime={this.state.bookTime}
                        startSaleTime={this.state.startSaleTime}
                        eachCountFigure={eachCountFigure}

                        pageBack={() => {
                            this.showPage('toMine')
                        }}
                    />
                </div>
                {/*关注详情*/}
                <div style={this.state.toAttentionProductDetail ? {width: '100%'} : {display: 'none'}}>
                    <AttentionProductDetail
                        bookSale={this.state.bookSale}
                        totalBookedCount={this.state.totalBookedCount}
                        totalCount={totalCount}

                        pageBack={() => {
                            this.showPage('toAttentionProductList')
                        }}

                        toBookedProductDetail={() => {
                            this.showPage('toBookedProductDetail')
                        }}
                    />
                </div>
                {/*预约详情*/}
                <div style={this.state.toBookedProductDetail ? {width: '100%'} : {display: 'none'}}>
                    <BookedProductDetail
                        bookCount={this.state.bookCount}
                        totalBookedCount={this.state.totalBookedCount}
                        totalCount={totalCount}
                        eachCountFigure={eachCountFigure}

                        pageBack={() => {
                            this.showPage('toAttentionProductDetail')
                        }}

                        onBookCountChange={this.onBookCountChange}

                        bookProduct={this.bookProduct}
                    />
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
