import React, {Component} from 'react';
import {Flex, Icon, List, NavBar, Progress, WhiteSpace, WingBlank} from "antd-mobile";


import head from './images/head.png'
import IconBook from './images/icon-book.png'
import IconAttention from './images/icon-attention.png'
import IconRealName from './images/icon-realname.png'

const Item = List.Item;

class Mine extends Component {
    render() {
        //functions
        const {minePageBack, tryToUserCertification, tryToAttentionProductList, tryToBookProductList} = this.props;

        //props
        const {userCertification} = this.props;

        return (
            <div style={{width: '100%'}}>

                <div style={{backgroundColor: "#353EA4", minHeight: '125px'}}>
                    <NavBar
                        leftContent="首页"
                        icon={<Icon type="left"/>}
                        onLeftClick={minePageBack}
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
                                <Progress percent={0} position="normal" unfilled={true}
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
                        arrow={userCertification ? 'none' : "horizontal"}
                        thumb={IconRealName}
                        onClick={tryToUserCertification}
                    >
                        实名认证 <div style={{
                        fontSize: '13px',
                        marginLeft: '5px',
                        color: '#512fff',
                        display: 'inline'
                    }}>{userCertification ? "(已通过)" : ''}</div>
                    </Item>
                    <Item
                        arrow="horizontal"
                        thumb={IconAttention}
                        onClick={tryToAttentionProductList}
                    >
                        我关注的产品
                    </Item>
                    <Item
                        arrow="horizontal"
                        thumb={IconBook}
                        onClick={tryToBookProductList}
                    >
                        我预约的产品
                    </Item>
                    {/*<Item*/}
                    {/*arrow="horizontal"*/}
                    {/*thumb={IconLogout}*/}
                    {/*onClick={() => {*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*退出登录*/}
                    {/*</Item>*/}
                </List>
            </div>
        );
    }
}

export default Mine;
