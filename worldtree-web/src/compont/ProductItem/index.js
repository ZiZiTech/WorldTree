import React, {PureComponent} from 'react';
import {WhiteSpace, Flex} from "antd-mobile";
import './index.css';
import IconLocation from './images/icon-location.png'
import IconLogo from './images/icon-logo.png'
import BgTop from './images/bg-top.png'
import BgBottom from './images/bg-bottom.png'

class ProductItem extends PureComponent {

    render() {
        return (
            <div className="card-container" onClick={this.props.toProjectDetail}>
                <div className="card-body">
                    <img src={BgTop} alt=""
                         style={{
                             width: '100%'
                         }}/>
                    <div style={{
                        padding: '5px',
                        border: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}>
                        <div style={{
                            display: 'flex',
                            position: 'absolute',
                            left: 10,
                            right: 10,
                            bottom: 10
                        }}>
                            <div style={{flex: 8, float: 'left'}}>
                                <span style={{fontSize: '0.8em'}}>太平洋东星债转股优先级计划4号</span>
                            </div>
                            <div style={{flex: 3}}>
                                <div className="status-tag">火爆预约中</div>
                            </div>
                            <div style={{flex: 4}}>
                                <div style={{
                                    textAlign: 'right',
                                    fontSize: '0.7em',
                                }}>
                                    <span>年化收益</span>&nbsp;
                                    <span style={{fontSize: '1.2em'}}>6%</span>&nbsp;
                                    <span>起</span>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace/>
                    </div>
                </div>
                <div className="card-foot">
                    <img src={BgBottom} alt=""
                         style={{
                             width: '100%'
                         }}/>
                    <Flex style={{
                        border: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}>
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
                </div>
            </div>
        );
    }
}

export default ProductItem;
