import React, {Component} from 'react';
import './ProductInfo.css';
import {WhiteSpace, WingBlank, NavBar, Icon, Progress, Modal, Toast} from "antd-mobile";

import ImageProductDetail01 from './images/image-product-detail01.png'
import ImageProductDetail02 from './images/image-product-detail02.png'
import ImageProductDetail03 from './images/image-product-detail03.png'
import ImageProductDetail04 from './images/image-product-detail04.png'
import ImageProductDetail05 from './images/image-product-detail05.png'
import ImageProductDetail06 from './images/image-product-detail06.png'
import BgProductItem from './images/bg-product-item.png'
import ImageShare from './images/image-share.jpeg'
import ajax from "../utils/ajax";
import cabin from '../utils/Logger';
const saleId = 1;
const productCode = "100010000";
const totalCount = 300;
const eachCountFigure = 20000;
const wx = window.jWeixin || require('weixin-js-sdk')

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

class ProductInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            carouseData: [ImageProductDetail01],
            // openId: 'wjswr12356',
            // hasBindWechat: false,
            invitationCodeModal: false,
            invitationCode: '',
            verityInvitationCodeCorrect: true,
            token: '',
            productAttentionStatus: false,//false未关注，true已关注
            totalBookedCount: 0,
            userCertification: false,
        };

        this.onWrapTouchStart = this.onWrapTouchStart.bind(this);
        this.verifyInvitationCode = this.verifyInvitationCode.bind(this);
        this.onInvitationCodeChange = this.onInvitationCodeChange.bind(this);
        this.productAttention = this.productAttention.bind(this);
        this.checkUserCertificationStatus = this.checkUserCertificationStatus.bind(this);
        this.previewResponse = this.previewResponse.bind(this);
    }

    previewResponse(res) {
        if (res === undefined) {
            Toast.fail("服务器出错");
            return;
        } else {
            if (res.code === 10001) {
                Toast.info("请先登录");
                window.location.href = "./home.html?nav_to=login";
                return;
            }
        }
    }

    /**
     * 判断是否已实名认证
     * @returns {Promise<void>}
     */
    async checkUserCertificationStatus() {
        //cabin.info("checkUserCertificationStatus")
        const res = await ajax.getUserCertification();
        //cabin.info("checkUserCertificationStatus res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res !== undefined && res.code === 10000) {
            if (!res.result.userCertification) {
                window.location.href = "./home.html?nav_to=login";
            } else {
                this.setState({
                    userCertification: res.result.userCertification,
                })
            }
        } else {
            Toast.info("请求失败");
        }

    }

    /**
     * 验证邀请码
     * @returns {Promise<void>}
     */
    async verifyInvitationCode() {
        const {invitationCode} = this.state;
        if (invitationCode !== undefined && '' !== invitationCode) {
            const res = await ajax.verifyInvitationCode(productCode, saleId, invitationCode);
            //cabin.info("verifyInvitationCode res = " + JSON.stringify(res));
            this.previewResponse(res);
            if (res !== undefined && res.code === 10000) {
                this.setState({
                    verityInvitationCodeCorrect: true,
                    invitationCodeModal: false,
                })
            } else {
                this.setState({
                    verityInvitationCodeCorrect: false,
                    invitationCodeModal: true,
                })
            }
        } else {
            Toast.info("验证码不能为空")
        }
    }

    /**
     * 关注产品
     * @returns {Promise<void>}
     */
    async productAttention() {
        //cabin.info("productAttention")
        const res = await ajax.attentionProduct(productCode, saleId);
        cabin.info("productAttention res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res !== undefined && res.code === 10000) {
            this.setState({
                productAttentionStatus: true,
            })
        } else {
            Toast.info("关注失败")
        }
    }

    /**
     * 获取产品详情
     * @returns {Promise<void>}
     */
    async getProductDetail() {
        const res = await ajax.getProductDetail(productCode, saleId);
        cabin.info("getProductDetail res = " + JSON.stringify(res));
        this.previewResponse(res);
        if (res.code !== undefined) {
            if (res.code === 11003) {
                this.setState({
                    invitationCodeModal: true,
                    productAttentionStatus: false,
                })
            } else if (res.code === 10000) {
                this.setState({
                    invitationCodeModal: false,
                    productAttentionStatus: res.result.attention,
                    totalBookedCount: res.result.bookedCount,
                })
            }
        } else {
            Toast.info("服务器出错")
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

    // /**
    //  * 尝试登录
    //  * @param nextStep
    //  * @returns {Promise<void>}
    //  */
    // async tryToLogin() {
    //     const res = await ajax.loginByOpenId(this.state.openId);
    //     //cabin.info("tryToLogin res = " + JSON.stringify(res));
    //     if (res != undefined && res.code === 10000) {
    //         this.setState({
    //             token: res.result.token,
    //             hasBindWechat: true,
    //         }, () => {
    //             this.getProductDetail();
    //         })
    //     } else {
    //         this.setState({
    //             productAttentionStatus: false,
    //             hasBindWechat: false,
    //         }, () => {
    //             this.getProductDetail();
    //         })
    //     }
    // }

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

    async configWechatJSSDK() {
        cabin.info(JSON.stringify("-----111222"))
        const url = window.location.href.split('#')[0];
        // const url = urlencode(window.location.href.split('#')[0]);
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
                    'updateTimelineShareData',
                    'updateAppMessageShareData',
                ]
            });

            wx.ready(function () {
                wx.updateAppMessageShareData({
                    title: '江苏无锡政府债转股项目', // 分享标题
                    desc: '江苏无锡政府债转股项目介绍', // 分享描述
                    link: 'http://dapa.inredata.com/finance/product_info.html?p_id=1', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: {ImageShare}, // 分享图标
                }, function (res) {//这里是回调函数
                    Toast.info("分享成功")
                });

                wx.updateTimelineShareData({
                    title: '江苏无锡政府债转股项目', // 分享标题
                    link: 'http://dapa.inredata.com/finance/product_info.html?p_id=1', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: {ImageShare}, // 分享图标
                }, function (res) {//这里是回调函数
                    Toast.info("分享成功")
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

    componentDidMount() {
        this.configWechatJSSDK();
        this.getProductDetail();
    }

    componentWillUnMount() {
    }

    render() {
        return (
            <div>
                <div className='title'>
                    <NavBar
                        leftContent="首页"
                        icon={<Icon type="left"/>}
                        onLeftClick=
                            {
                                () => {
                                    window.location.href = "./home.html";
                                }
                            }
                    >项目介绍</NavBar>
                </div>
                <div className="content">
                    <div style={{backgroundColor: '#efefef'}}>
                        <div style={{width: '100%', backgroundColor: '#ffffff'}}>
                            <img style={{width: '100%'}} src={ImageProductDetail01} alt=""/>
                            <WingBlank>
                                <div
                                    style={{marginTop: '-30px', color: '#ffffff', fontWeight: 'bold'}}>江苏无锡·惠山洛社政府债转股项目
                                </div>
                            </WingBlank>
                            <WingBlank>
                                <div style={{marginTop: '20px', paddingBottom: '20px'}}>
                                    <p style={{fontWeight: 'bold'}}>相关媒体</p>
                                    <div style={{color: '#446eff', fontSize: '12px'}}>
                                        <div>无锡市惠山区洛社镇人民政府关于做好债转股工作的通知</div>
                                        <div style={{marginTop: '3px'}}>洛社镇开展债转股试点工作</div>
                                    </div>
                                </div>
                            </WingBlank>
                        </div>
                    </div>

                    <div style={{width: '100%', backgroundColor: '#ffffff', marginTop: '15px', paddingBottom: '10px'}}>
                        <WhiteSpace/>
                        <div className="product-card-container" onClick={this.props.toProjectDetail}>
                            <img src={BgProductItem} alt=""
                                 style={{
                                     width: '100%'
                                 }}/>
                            <div className="product-card-body">

                                <div style={{
                                    display: 'flex',
                                }}>
                                    <div style={{flex: 4}}>
                                        <div style={{
                                            display: 'flex',
                                            paddingLeft: '10px',
                                            paddingTop: '5px'
                                        }}>
                                            <div style={{flex: 3}}><span
                                                style={{fontSize: '0.9em'}}>太平洋东星债转股优先级计划4号</span>
                                            </div>
                                            <div style={{flex: 1}}>
                                                <div className="product-status-tag">火爆预约中</div>
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            paddingLeft: '10px',
                                            paddingTop: '5px',
                                            textAlign: 'center'
                                        }}>
                                            <Progress
                                                percent={(this.state.totalBookedCount / totalCount * 100).toFixed(2)}
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
                                                paddingLeft: '10px'
                                            }}>
                                                <span>{(this.state.totalBookedCount / totalCount * 100).toFixed(2)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{flex: 1, marginTop: '5px'}}><input onClick={this.productAttention}
                                                                                    type="button"
                                                                                    className="attentionButton"
                                                                                    value={this.state.productAttentionStatus ? "已关注" : '关注'}
                                                                                    disabled={!this.state.productAttentionStatus ? '' : 'disabled'}/>
                                    </div>
                                </div>

                                <div style={{
                                    color: '#ffffff',
                                    fontSize: '0.8em',
                                    textAlign: 'center',
                                    display: 'flex',
                                    position: 'absolute',
                                    bottom: '10px',
                                    left: '5px',
                                    right: '5px',
                                }}>
                                    <div style={{flex: '9',}}>募资金额 12000000</div>
                                    <div style={{flex: '1', fontSize: '12px', transform: 'scale(0.70)'}}>|</div>
                                    <div style={{flex: '3'}}>优先股</div>
                                    <div style={{flex: '1', fontSize: '12px', transform: 'scale(0.70)'}}>|</div>
                                    <div style={{flex: '3'}}>30天</div>
                                    <div style={{flex: '1', fontSize: '12px', transform: 'scale(0.70)'}}>|</div>
                                    <div style={{flex: '9'}}>预计年化收益 18.27%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{width: '100%', backgroundColor: '#ffffff', marginTop: '15px'}}>
                        <a name="survey"/>
                        <img style={{width: '100%'}} src={ImageProductDetail02} alt=""/>
                        <WingBlank>
                            <div style={{marginTop: '20px', paddingBottom: '20px'}}>
                                <p style={{fontWeight: 'bold'}}>项目介绍</p>
                                <div style={{color: '#000000', fontSize: '12px'}}>
                                    太平洋东星债转股基金由无锡市惠山区洛社镇镇政府下核心国企2A平台无锡惠鑫汇资产经营管理有限公司（以下简称惠鑫汇）兜底担保，资金用于投资国企平台下的拟上市公司。
                                    基金总规模100亿人民币。<br/>

                                    项目所在地洛社镇位于江南名城无锡，距无锡市区约12公里，是无锡市主城区西侧的卫星城。全镇总面积93.45平方公里，总人口超过15万人。
                                    2017年，洛社镇实现地区生产总值199.2亿元，财政收入28亿元。<br/>

                                    本基金用于投资洛社镇的智慧城市项目，现金流稳定，前景极好。<br/>
                                    本基金投资项目新洛新市政发展有限公司是洛社镇未来财政收入、财政支出、地方建设、城市投资、招商引资等经济行为的唯一平台。<br/>

                                </div>
                            </div>
                        </WingBlank>
                    </div>

                    <div style={{width: '100%', backgroundColor: '#ffffff', marginTop: '15px'}}>
                        <a name="introduction"/>
                        <img style={{width: '100%'}} src={ImageProductDetail03} alt=""/>
                        <WingBlank>
                            <div style={{marginTop: '20px', paddingBottom: '20px'}}>
                                <p style={{fontWeight: 'bold'}}>标的介绍</p>
                                <div style={{color: '#000000', fontSize: '12px'}}>
                                    无锡新洛新市镇发展有限公司<br/>
                                    企业介绍：企业主要经营范围为新市镇的改造、建设，社区建设，市政基础设施建设，环境治理、改造、绿化，流域治理，房屋拆迁，利用自有资金对外投资，农业园开发与经营。企业注册资本为47000万元。<br/>
                                    企业股东：无锡惠山新农村建设发展有限公司、无锡惠鑫汇资产经营管理有限公司。<br/>
                                    盈利预期：预计到2020年，公司全年利润不低于10亿元；预计到2021年，公司全年利润不低于10.8亿币；预计到2022年IPO阶段公司全年利润不低于11.8亿元。<br/>
                                </div>
                            </div>
                        </WingBlank>
                    </div>

                    <div style={{width: '100%', backgroundColor: '#ffffff', marginTop: '15px'}}>
                        <a name="guaranty_style"/>
                        <img style={{width: '100%'}} src={ImageProductDetail04} alt=""/>
                        <WingBlank>
                            <div style={{marginTop: '20px', paddingBottom: '20px'}}>
                                <p style={{fontWeight: 'bold'}}>担保方式</p>
                                <div style={{color: '#000000', fontSize: '12px'}}>
                                    结构安排<br/>
                                    基金层面的社会资本优先退出：本基金的20%劣后级由债转股引导基金认募<br/>
                                    标的项目层面的社会资本优先清算：中20%底层普通股由劣后部分认购<br/>
                                    增信安排<br/>
                                    回购安排：首先在基金内部清算，劣后方回购，不足部分由增信方回购，再不足部分由兜底方补足<br/>
                                    其他增信：由无锡大衍洛龙商业运营合伙企业（有限合伙）对期间流动性及最终清偿做期间担保；也可以根据实际募集要求，引入其他第三方增信<br/>
                                </div>
                            </div>
                        </WingBlank>
                    </div>

                    <div style={{width: '100%', backgroundColor: '#ffffff', marginTop: '15px'}}>
                        <a name="management_team"/>
                        <img style={{width: '100%'}} src={ImageProductDetail05} alt=""/>
                        <WingBlank>
                            <div style={{marginTop: '20px', paddingBottom: '20px'}}>
                                <p style={{fontWeight: 'bold'}}>管理团队</p>
                                <div style={{color: '#000000', fontSize: '12px'}}>
                                    杭州大衍春秋投资管理有限公司是大衍资本和无锡市惠山区洛社政府共同成立，由大衍资本运营以及管理的一家专业从事于无锡市惠山区洛社镇债转股业务的资产管理公司。<br/>
                                    <WhiteSpace/>
                                    <img style={{width: '100%'}} src={ImageProductDetail06} alt=""/>
                                    <WhiteSpace/>
                                    大衍资本在城市建设开发及产业投资运营方向上基于大数据建模，可以综合汇率、利率、产业发展规律，以及供应链相关数据，实现跨金融周期和产业周期的长效投资管理服务，为政府资产保值增值，为投资人的投资提升价值。<br/>

                                    无锡洛龙新能源股权投资合伙企业（有限合伙）是政府全资引导基金，也是本次计划的劣后方。<br/>
                                </div>
                            </div>
                        </WingBlank>
                    </div>
                </div>

                <Modal
                    visible={this.state.invitationCodeModal}
                    transparent
                    closable={false}
                    animationType='slide-up'
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
        )
    }
}

export default ProductInfo;
