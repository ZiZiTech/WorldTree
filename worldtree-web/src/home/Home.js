'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Home.css';
import {
    ListView,
    NavBar,
    Flex,
    Icon,
    Progress,
    List,
    WingBlank,
    WhiteSpace,
    Modal, Stepper, ImagePicker
} from "antd-mobile";
import {isWeixin, Trim, ValidateMobile} from "../utils";
import ajax from "../utils/ajax";
import head from './head.png'
import ProductItem from "../compont/ProductItem";
import CodeBox from "../compont/CodeBox"
import {district, provinceLite} from 'antd-mobile-demo-data';
import IconMine from './icon-mine.png'

import IconLocation from './icon-location.png'
import IconLocationBlack from './icon-location-black.png'
import IconLogo from './icon-logo.png'
import IconBook from './icon-book.png'
import IconLogout from './icon-logout.png'
import IconAttention from './icon-attention.png'
import IconRealName from './icon-realname.png'
import ImageProductDetail01 from './image-product-detail01.png'
import BgProductItem from './bg-product-item.png'

const Item = List.Item;

const smsRequestInterval = 60;
const saleId = 1;
const productCode = "100010000";
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

            //用户凭证
            openId: 'wjswr123',
            token: '',

            //是否完成实名认证
            userCertification: false,

            //预约份额
            bookCount: 1,

            //是否关注了saleId为1的产品
            attentionSale: false,
            //是否预约了saleId为1的产品
            bookSale: false,
            //身份证
            faceIdImages: [],
            faceRecognized: false,
            backIdImages: [],
            backRecognize: false,
        };

        this.showPage = this.showPage.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onWrapTouchStart = this.onWrapTouchStart.bind(this);
        this.tick = this.tick.bind(this);
        this.getSmsCode = this.getSmsCode.bind(this);
        this.showOrCloseCodeInputView = this.showOrCloseCodeInputView.bind(this);
        this.tryToLogin = this.tryToLogin.bind(this);
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
    }

    handleRecognize(data, side) {
        this.recognizeID(data).catch((err) => {
            console.log(JSON.stringify(err.text));
            const recognizeInfo = JSON.parse(err.text);
            console.log(JSON.stringify(recognizeInfo));
            //识别成功
            if (recognizeInfo != undefined) {
                if (recognizeInfo.success) {//识别成功
                    switch (side) {
                        case 'face':
                            this.setState({});
                            break
                        case 'back':
                            this.setState({});
                            break
                        default:
                            break
                    }
                } else {//识别失败

                }
            } else {//识别失败

            }
        });
    }

    async recognizeID(data) {
        const res = await ajax.recognizeID(data);
        console.log("recognizeID res = " + JSON.stringify(res));
    }

    onFaceIDImagesChange(files, type, index) {
        this.onIDImagesChange(files, type, index, 'face');
    }

    onBackIDImagesChange(files, type, index) {
        this.onIDImagesChange(files, type, index, 'back');
    }

    onIDImagesChange(files, type, index, side) {
        console.log(files, type, index, side);
        switch (side) {
            case 'face':
                this.setState({
                    faceIdImages: files,
                }, () => {
                    if (files.length > 0) {
                        const data =
                            {
                                "configure": "{\"side\":\"face\"}",
                                "image": files[0].url.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', ''),
                            };
                        this.handleRecognize(data, side);
                    }
                });
                break;
            case 'back':
                this.setState({
                    backIdImages: files,
                }, () => {
                    if (files.length > 0) {
                        const data =
                            {
                                "configure": "{\"side\":\"back\"}",
                                "image": files[0].url.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', ''),
                            };
                        this.handleRecognize(data, side);
                    }
                });
                break;
            default:
                break
        }
    }

    async bookProduct() {
        const res = await ajax.bookProduct(productCode, saleId, this.state.bookCount, this.state.token);
        console.log("bookProduct res = " + JSON.stringify(res));
        let vBookSale = false;
        if (res.code != undefined && res.code === 10000) {
            vBookSale = true;
        }
        this.setState({
            bookSale: vBookSale,
        }, () => {
            this.showPage('toAttentionProductDetail')
        })
    }

    async tryToAttentionProductDetail() {
        const res = await ajax.getProductBookStatus(productCode, saleId, this.state.token);
        console.log("tryToBookProductList res = " + JSON.stringify(res));
        let vBookSale = true;
        if (res.code != undefined && !res.result.booked) {
            vBookSale = false;
        }
        this.setState({
            bookSale: vBookSale,
        }, () => {
            this.showPage('toAttentionProductDetail')
        })
    }

    async tryToAttentionProductList() {
        const res = await ajax.getProductDetail(productCode, saleId, this.state.openId, this.state.token);
        console.log("tryToAttentionProductList res = " + JSON.stringify(res));
        let vAttentionSale = true;
        if (res.code != undefined && !res.result.attention) {
            vAttentionSale = false;
        }
        this.setState({
            attentionSale: vAttentionSale,
        }, () => {
            this.showPage('toAttentionProductList')
        })
    }

    async tryToBookProductList() {
        const res = await ajax.getProductBookStatus(productCode, saleId, this.state.token);
        console.log("tryToBookProductList res = " + JSON.stringify(res));
        let vBookSale = true;
        if (res.code != undefined && !res.result.booked) {
            vBookSale = false;
        }
        this.setState({
            bookSale: vBookSale,
        }, () => {
            this.showPage('toBookedProductList')
        })
    }


    /**
     * 验证邀请码
     * @returns {Promise<void>}
     */
    async verifyInvitationCode() {
        const {invitationCode} = this.state;
        if (invitationCode != undefined && '' !== invitationCode) {
            const res = await ajax.verifyInvitationCode(productCode, saleId, this.state.openId, invitationCode, this.state.token);
            console.log("verifyInvitationCode res = " + JSON.stringify(res));
            if (res != undefined && res.code === 10000) {
                if (typeof window !== undefined) {
                    window.location.href = "../product_info.html?p_id=1";
                } else {
                    alert("系统异常")
                }
            } else {
                this.setState({
                    verityInvitationCodeCorrect: false
                })
            }
        } else {
            alert("验证码不能为空")
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
        console.log("checkUserCertificationStatus")
        const res = await ajax.getUserCertification(this.state.token);
        console.log("checkUserCertificationStatus res = " + JSON.stringify(res));
        let vUserCertification = false;
        if (res != undefined && res.code === 10000 && res.result.userCertification) {
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
        console.log("toProjectDetail")
        if (this.state.token != '' && this.state.token != undefined) {
            const res = await ajax.getProductDetail(productCode, saleId, this.state.openId, this.state.token);
            console.log("getProductDetail res = " + JSON.stringify(res));
            if (res.code != undefined && res.code === 11003) {
                this.setState({
                    invitationCodeModal: true,
                })
            } else {
                if (typeof window !== undefined) {
                    window.location.href = "../product_info.html?p_id=1";
                }
            }
        } else {
            this.tryToLogin(async () => {
                const res = await ajax.getProductDetail(productCode, saleId, this.state.openId, this.state.token);
                console.log("getProductDetail res = " + JSON.stringify(res));
                if (res.code != undefined && res.code === 11003) {
                    this.setState({
                        invitationCodeModal: true,
                    })
                } else {
                    if (typeof window !== undefined) {
                        window.location.href = "../product_info.html?p_id=1";
                    }
                }
            });
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
            console.log("getSmsCode res = " + JSON.stringify(res));
            if (res != undefined && res.code === 10000) {
                this.tick()
            } else {
                alert("获取验证码失败")
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
     * 尝试登录
     * @param nextStep
     * @returns {Promise<void>}
     */
    async tryToLogin(nextStep) {
        const res = await ajax.loginByOpenId(this.state.openId);
        console.log("tryToLogin res = " + JSON.stringify(res));
        if (res != undefined && res.code === 10000) {
            this.setState({
                token: res.result.token,
            }, () => {
                if (typeof nextStep === "function") {
                    nextStep();
                }
            })
        } else {
            this.showPage('toLogin')
        }
    }

    /**
     * 尝试绑定微信openId
     * @param smsCode
     * @returns {Promise<void>}
     */
    async tryToBindOpenId(smsCode) {
        const param = {"vCode": smsCode, "phoneNumber": this.state.phone, "openId": this.state.openId};
        const res = await ajax.bindWechat(param);
        console.log("tryToBindOpenId res = " + JSON.stringify(res));
        if (res != undefined && res.code === 10000) {
            this.setState({
                token: res.result.token,
            }, () => {
                this.showPage('toMine')
            })
        } else {
            alert("登录失败")
        }
    }

    componentDidMount() {

    }

    componentWillUnMount() {
        clearInterval(this.interval);
        this.interval = null;
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
                <div style={this.state.toHome ? {width: '100%'} : {display: 'none'}}>
                    <NavBar
                        rightContent={[
                            <img key={1} style={{width: '15px', height: '15px'}} src={IconMine}
                                 alt={""} onClick={() => {
                                if (this.state.token != '' && this.state.token != undefined) {
                                    this.showPage("toMine");
                                } else {
                                    this.tryToLogin(() => {
                                        this.showPage("toMine");
                                        this.checkUserCertificationStatus();
                                    });
                                }
                            }}/>
                        ]}
                    >大衍金融</NavBar>
                    <ProductItem toProjectDetail={this.toProjectDetail}/>
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
                                    <Progress percent={40} position="normal" unfilled={true}
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
                                this.showPage('toUserCertification')
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
                        <Item
                            arrow="horizontal"
                            thumb={IconLogout}
                            onClick={() => {
                            }}
                        >
                            退出登录
                        </Item>
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
                                        this.showPage('toMine');
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
                                console.log(phone);
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
                                console.log(smsCode);
                                if (smsCode != undefined && smsCode !== '' && (smsCode.length === 6)) {
                                    this.tryToBindOpenId(smsCode);
                                }
                            }}
                        />
                        <p style={{marginTop: '10px', marginBottom: '10px'}}>请填写验证码</p>
                        <p onClick={this.getSmsCode}>{this.state.secondsElapsed === smsRequestInterval ? "重新发送" : "剩余" + this.state.secondsElapsed + "秒"}</p>
                    </div>
                </div>

                <div style={this.state.toUserCertification ? {width: '100%'} : {display: 'none'}}>
                    <NavBar
                        leftContent="我"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.showPage('toMine')
                        }}
                    >实名认证</NavBar>

                    <ImagePicker
                        key={0}
                        files={this.state.faceIdImages}
                        onChange={this.onFaceIDImagesChange}
                        selectable={this.state.faceIdImages.length < 1}
                        length={1}
                    />

                    <ImagePicker
                        key={1}
                        files={this.state.backIdImages}
                        onChange={this.onBackIDImagesChange}
                        selectable={this.state.backIdImages.length < 1}
                        length={1}
                    />
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
                                        <Progress percent={40} position="normal" unfilled={true}
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
                                        }}><span>80%</span></div>
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
                                    <div style={{marginBottom: '5px'}}><span>预约时间 2018/12/12 22:22</span></div>
                                    <Flex>
                                        <Flex.Item><span>预约认筹金额 2000</span></Flex.Item>
                                        <Flex.Item
                                            style={{textAlign: 'right'}}><span>预约开发时间 2018/12/14</span></Flex.Item>
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
                                    <Progress percent={40} position="normal" unfilled={true}
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
                                    80%
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
                                    <Progress percent={40} position="normal" unfilled={true}
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
                                    80%
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
                                        fontSize: '3em',
                                        lineHeight: '70%'
                                    }}>
                                        ¥1000000
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
                                        <div style={{fontSize: '12px', color: '#9c9c9c'}}>剩余数量 300</div>
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
                                            max={10}
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
