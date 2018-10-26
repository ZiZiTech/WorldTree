import React, {Component} from 'react';
import {Flex, Icon, NavBar, Progress, WhiteSpace} from "antd-mobile";


import IconLocation from './images/icon-location.png'
import IconLogo from './images/icon-logo.png'
import BgProductItem from './images/bg-product-item.png'

class AttentionProductList extends Component {
    render() {
        //functions
        const {pageBack, tryToAttentionProductDetail} = this.props;

        //props
        const {attentionSale, totalBookedCount, totalCount} = this.props;

        return (
            <div style={{width: '100%'}}>
                <NavBar
                    leftContent="我"
                    icon={<Icon type="left"/>}
                    onLeftClick={pageBack}
                >我关注的产品</NavBar>
                <div style={attentionSale ? {
                    width: '100%',
                    marginTop: '15px',
                    paddingBottom: '10px'
                } : {display: 'none'}}>
                    <WhiteSpace/>
                    <div className="product-card-container" onClick={tryToAttentionProductDetail}>
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
                                    <Progress percent={(totalBookedCount / totalCount * 100).toFixed(2)}
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
                                    }}><span>{(totalBookedCount / totalCount * 100).toFixed(2)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AttentionProductList;
