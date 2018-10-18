import React, {PureComponent} from 'react';
import {Card, WingBlank, WhiteSpace, Flex, Progress, Tag} from "antd-mobile";
import './index.css';
import IconLocation from './icon-location.png'
import IconLogo from './icon-logo.png'

class ProductItem extends PureComponent {

    render() {
        return (
            <div className="card-container" onClick={this.props.toProjectDetail}>
                <div className="card-body">
                    <div style={{
                        marginTop: '70px'
                    }}>
                        <div style={{display: 'flex'}}>
                            <div style={{flex: 8,float:'left'}}>
                                <span style={{fontSize: '12px'}}>太平洋东星债转股优先级计划4号</span>
                            </div>
                            <div style={{flex: 3}}>
                                <div className="status-tag">火爆预约中</div>
                            </div>
                            <div style={{flex: 4}}>
                                <div style={{
                                    textAlign: 'right',
                                    fontSize: '80%',
                                }}>
                                    <span style={{fontSize: '12px'}}>年化收益</span>&nbsp;
                                    <span style={{fontSize: '1.4em'}}>6%</span>&nbsp;
                                    <span style={{fontSize: '12px'}}>起</span>
                                </div>
                            </div>
                        </div>
                        <WhiteSpace/>
                    </div>
                </div>
                <div className="card-foot">
                    <Flex>
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
                    {/*<WhiteSpace/>*/}
                    {/*<Flex>*/}
                    {/*<Flex.Item style={{flex: 9, marginLeft: '12px', marginRight: '12px'}}>*/}
                    {/*<Progress percent={40} position="normal" unfilled={true}*/}
                    {/*appearTransition*/}
                    {/*style={{*/}
                    {/*backgroundColor: '#2F3F75',*/}
                    {/*borderRadius: '5px 5px 5px 5px'*/}
                    {/*}}*/}
                    {/*barStyle={{*/}
                    {/*border: '4px solid #FCB53F',*/}
                    {/*borderRadius: '5px 0px 0px 5px'*/}
                    {/*}}/>*/}
                    {/*</Flex.Item>*/}
                    {/*<Flex.Item style={{flex: 1}}>*/}
                    {/*<span>80%</span>*/}
                    {/*</Flex.Item>*/}
                    {/*</Flex>*/}
                </div>
            </div>
        );
    }
}

export default ProductItem;
