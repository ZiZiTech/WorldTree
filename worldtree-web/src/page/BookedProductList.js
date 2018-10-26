import React, {Component} from 'react';
import {Flex, Icon, NavBar, WhiteSpace} from "antd-mobile";

import BgProductItem from './images/bg-product-item.png'

class BookedProductList extends Component {
    render() {
        //functions
        const {pageBack} = this.props;

        //props
        const {bookSale, myBookedCount, bookTime, eachCountFigure, startSaleTime} = this.props;

        return (
            <div style={{width: '100%'}}>
                <NavBar
                    leftContent="我"
                    icon={<Icon type="left"/>}
                    onLeftClick={pageBack}
                >我预约的产品</NavBar>
                <div style={bookSale ? {
                    width: '100%',
                    marginTop: '15px',
                    paddingBottom: '10px'
                } : {display: 'none'}}>
                    <WhiteSpace/>
                    <div className="product-card-container">
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
                                <div style={{marginBottom: '5px'}}><span>预约时间 {bookTime}</span></div>
                                <Flex>
                                    <Flex.Item><span>预约认筹金额 {myBookedCount * eachCountFigure}</span></Flex.Item>
                                    <Flex.Item
                                        style={{textAlign: 'right'}}>
                                            <span>
                                                开放认筹时间 {startSaleTime}
                                                </span>
                                    </Flex.Item>
                                </Flex>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BookedProductList;
