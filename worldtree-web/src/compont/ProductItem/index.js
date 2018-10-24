import React, {PureComponent} from 'react';
import {WhiteSpace, Flex} from "antd-mobile";
import './index.css';
import IconLocation from './images/icon-location.png'
import IconLogo from './images/icon-logo.png'
import BgBottom from './images/bg-bottom.png'

class ProductItem extends PureComponent {
//惠山洛社政府债转股项目
    render() {
        return (
            <div className="card-container" onClick={this.props.toProjectDetail}>
                <div className="card-body">
                    <img src={this.props.bgTop} alt=""
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
                            <div style={{flex: 2, float: 'left'}}>
                                <span style={{fontSize: '1.1em', fontWeight: 'bold'}}>{this.props.project}</span>
                            </div>
                            <div style={{flex: 1}}>
                                <div style={{
                                    textAlign: 'right',
                                    fontSize: '0.8em',
                                }}>
                                    <span>年化收益</span>&nbsp;
                                    <span style={{fontSize: '1.4em', fontWeight: 'bold'}}>6%</span>
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
                        <Flex.Item style={{flex: 6, textAlign: 'left', marginLeft: '-8px'}}>
                            <span>{this.props.location}</span>
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
