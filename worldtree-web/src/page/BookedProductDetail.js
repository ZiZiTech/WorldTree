import React, {Component} from 'react';
import {Flex, Icon, NavBar, Progress, Stepper, WhiteSpace, WingBlank} from "antd-mobile";

import ImageProductDetail01 from './images/image-product-detail01.png'
import IconLocationBlack from './images/icon-location-black.png'

class BookedProductDetail extends Component {
    render() {
        //functions
        const {pageBack, onBookCountChange, bookProduct} = this.props;

        //props
        const {bookCount, totalBookedCount, totalCount, eachCountFigure} = this.props;

        return (
            <div style={{width: '100%'}}>
                <NavBar
                    icon={<Icon type="left"/>}
                    onLeftClick={pageBack}
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
                                    ¥{bookCount * eachCountFigure}
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
                                    }}>剩余数量 {300 - totalBookedCount - bookCount}</div>
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
                                        max={(totalBookedCount > 150) ? (300 - totalBookedCount - bookCount) : 150}
                                        min={1}
                                        defaultValue={1}
                                        value={bookCount}
                                        onChange={onBookCountChange}
                                    />
                                </Flex.Item>
                            </Flex>
                        </div>
                    </WingBlank>
                    <WhiteSpace/>
                </div>
                <div className="footer-button" onClick={bookProduct}>确认预约</div>
            </div>
        );
    }
}

export default BookedProductDetail;
