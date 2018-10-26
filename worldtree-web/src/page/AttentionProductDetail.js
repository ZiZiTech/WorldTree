import React, {Component} from 'react';
import {Flex, Icon, NavBar, Progress, WhiteSpace, WingBlank} from "antd-mobile";

import ImageProductDetail01 from './images/image-product-detail01.png'
import IconLocationBlack from './images/icon-location-black.png'

class AttentionProductDetail extends Component {
    render() {
        //functions
        const {pageBack, toBookedProductDetail} = this.props;

        //props
        const {bookSale, totalBookedCount, totalCount} = this.props;

        return (
            <div style={{width: '100%'}}>
                <NavBar
                    icon={<Icon type="left"/>}
                    onLeftClick={pageBack}
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
                            <Flex.Item style={{flex: 6}}>
                                <Progress percent={(totalBookedCount / totalCount * 100).toFixed(2)}
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
                                {(totalBookedCount / totalCount * 100).toFixed(2)}%
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
                <div className="footer-button" onClick={toBookedProductDetail}
                     style={bookSale ? {display: 'none'} : {}}>立即预约
                </div>
            </div>
        );
    }
}

export default AttentionProductDetail;
