import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Home.css';

import {
    ListView,
    Picker,
    Carousel,
    Tag,
    Flex,
    Icon,
    Progress,
    List,
    TabBar,
    SearchBar,
    Button,
    WingBlank,
    WhiteSpace
} from "antd-mobile";
import HomeProductItem from '../compont/HomeProductItem'
import {isWeixin} from "../utils";
import ajax from "../utils/ajax";
import head from './images/head.png'
import ProductItem from "../compont/ProductItem";
import {district, provinceLite} from 'antd-mobile-demo-data';

const Item = List.Item;

function MyBody(props) {
    return (
        <div className="am-list-body my-body">
            <span style={{display: 'none'}}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}

const data = [
    {
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        title: 'Meet hotel',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
        title: 'McDonald\'s invites you',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
    {
        img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
        title: 'Eat the week',
        des: '不是所有的兼职汪都需要风吹日晒',
    },
];
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

function genData(pIndex = 0) {
    for (let i = 0; i < NUM_SECTIONS; i++) {
        const ii = (pIndex * NUM_SECTIONS) + i;
        const sectionName = `Section ${ii}`;
        sectionIDs.push(sectionName);
        dataBlobs[sectionName] = sectionName;
        rowIDs[ii] = [];

        for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
            const rowName = `S${ii}, R${jj}`;
            rowIDs[ii].push(rowName);
            dataBlobs[rowName] = rowName;
        }
    }
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];
}

class ListViewExample extends React.Component {
    constructor(props) {
        super(props);
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

        const dataSource = new ListView.DataSource({
            getRowData,
            getSectionHeaderData: getSectionData,
            rowHasChanged: (row1, row2) => row1 !== row2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource,
            isLoading: true,
            height: (document.documentElement.clientHeight * 3) / 4,
        };

        this.onEndReached = this.onEndReached.bind(this);
    }

    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        setTimeout(() => {
            genData();
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                isLoading: false,
                height: hei,
            });
        }, 600);
    }

    onEndReached(event) {
        if (this.state.isLoading && !this.state.hasMore) {
            return;
        }
        console.log('reach end', event);
        this.setState({isLoading: true});
        setTimeout(() => {
            genData(++pageIndex);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                isLoading: false,
            });
        }, 1000);
    }

    render() {
        let index = data.length - 1;
        const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
                index = data.length - 1;
            }
            const obj = data[index--];
            return (
                <ProductItem key={index}/>
            );
        };

        return (
            <ListView
                ref={el => this.lv = el}
                dataSource={this.state.dataSource}
                renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
                    {this.state.isLoading ? '加载中...' : '已全部加载'}
                </div>)}
                renderRow={row}
                style={{
                    height: this.state.height,
                    overflow: 'auto',
                }}
                pageSize={4}
                onScroll={() => {
                    console.log('scroll');
                }}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
            />
        );
    }
}


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'mineTab',
            hidden: false,
            fullScreen: true,

            carouseData: [],
            imgHeight: 176,
        };

        this.jumpToBuy = this.jumpToBuy.bind(this);
        this.seeDetail = this.seeDetail.bind(this);
    }

    async jumpToBuy() {
        //获取openId

        //判断是否已绑定
        const openId = 'testOpenId';
        console.log("checkBindStatus openId = " + openId);
        const res = await ajax.loginByOpenId(openId);
        console.log("checkBindStatus res = " + JSON.stringify(res));

        //如果已绑定

        //如果未绑定
    }


    seeDetail() {
        alert('seeDetail');
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <div style={this.state.fullScreen ? {
                    position: 'fixed',
                    height: '100%',
                    width: '100%',
                    top: 0
                } : {height: 400}}>

                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#33A3F4"
                        barTintColor="white"
                        hidden={this.state.hidden}
                    >
                        <TabBar.Item
                            title="主页"
                            key="Home"
                            icon={<div style={{
                                width: '22px',
                                height: '22px',
                                background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat'
                            }}
                            />
                            }
                            selectedIcon={<div style={{
                                width: '22px',
                                height: '22px',
                                background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat'
                            }}
                            />
                            }
                            selected={this.state.selectedTab === 'homeTab'}
                            badge={1}
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'homeTab',
                                });
                            }}
                            data-seed="logId"
                        >
                            <div>
                                <div style={{backgroundColor: "#353EA4"}}>
                                    <header className="App-header">
                                        世界树
                                    </header>

                                    <SearchBar
                                        placeholder="手动获取获取光标"
                                        ref={ref => this.manualFocusInst = ref}
                                    />
                                </div>

                                <Carousel
                                    autoplay={false}
                                    dots={false}
                                    infinite
                                    beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                                    afterChange={index => console.log('slide to', index)}
                                >
                                    {this.state.carouseData.map(val => (
                                        <a
                                            key={val}
                                            href=""
                                            style={{
                                                display: 'inline-block',
                                                width: '100%',
                                                height: this.state.imgHeight
                                            }}
                                        >
                                            <img
                                                src={val}
                                                alt=""
                                                style={{width: '100%', verticalAlign: 'top'}}
                                                onLoad={() => {
                                                    // fire window resize event to change height
                                                    window.dispatchEvent(new Event('resize'));
                                                    this.setState({imgHeight: 'auto'});
                                                }}
                                            />
                                        </a>
                                    ))}
                                </Carousel>

                                <List>
                                    <Item
                                        onClick={() => {
                                        }}
                                    ><HomeProductItem images={[1]}/></Item>
                                    <Item
                                        onClick={() => {
                                        }}
                                    >
                                        <HomeProductItem images={[1, 1, 1]}/>
                                    </Item>

                                    <Item
                                        onClick={() => {
                                        }}
                                    >
                                        <HomeProductItem images={[1, 1, 1, 1]}/>
                                    </Item>
                                </List>
                            </div>
                        </TabBar.Item>
                        <TabBar.Item
                            icon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(https://gw.alipayobjects.com/zos/rmsportal/BTSsmHkPsQSPTktcXyTV.svg) center center /  21px 21px no-repeat'
                                }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(https://gw.alipayobjects.com/zos/rmsportal/ekLecvKBnRazVLXbWOnE.svg) center center /  21px 21px no-repeat'
                                }}
                                />
                            }
                            title="项目"
                            key="Product"
                            badge={'new'}
                            selected={this.state.selectedTab === 'productTab'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'productTab',
                                });
                            }}
                            data-seed="logId1"
                        >
                            <div>

                                <div style={{backgroundColor: "#353EA4"}}>
                                    <header className="App-header">
                                        项目
                                    </header>

                                    <Flex>
                                        <Flex.Item>
                                            <div style={{textAlign: 'center', color: '#ffffff'}}>全部</div>
                                        </Flex.Item>
                                        <Flex.Item><Picker extra="请选择(可选)"
                                                           data={district}
                                                           title="Areas"
                                                           onOk={e => console.log('ok', e)}
                                                           onDismiss={e => console.log('dismiss', e)}>
                                            <Flex.Item>
                                                <div style={{textAlign: 'center', color: '#ffffff'}}>城市 ></div>
                                            </Flex.Item>
                                        </Picker>
                                        </Flex.Item>
                                        <Flex.Item>
                                            <Picker extra="请选择(可选)"
                                                    data={district}
                                                    title="Areas"
                                                    onOk={e => console.log('ok', e)}
                                                    onDismiss={e => console.log('dismiss', e)}>
                                                <Flex.Item>
                                                    <div style={{textAlign: 'center', color: '#ffffff'}}>类别 ></div>
                                                </Flex.Item>
                                            </Picker>
                                        </Flex.Item>
                                    </Flex>
                                    <WhiteSpace/>
                                </div>

                                <div>
                                    <ListViewExample/>
                                </div>
                            </div>
                        </TabBar.Item>
                        <TabBar.Item
                            icon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat'
                                }}
                                />
                            }
                            selectedIcon={
                                <div style={{
                                    width: '22px',
                                    height: '22px',
                                    background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat'
                                }}
                                />
                            }
                            title="我的"
                            key="Mine"
                            dot
                            selected={this.state.selectedTab === 'mineTab'}
                            onPress={() => {
                                this.setState({
                                    selectedTab: 'mineTab'
                                });
                            }}
                        >
                            <div>

                                <div style={{backgroundColor: "#373d97"}}>
                                    <header className="App-header">
                                        我的
                                    </header>

                                    <Flex>
                                        <Flex.Item style={{flex: 1,textAlign:'end'}}>
                                            <img style={{width: '40px', height: '40px'}} src={head}
                                                 alt={""}/>
                                        </Flex.Item>
                                        <Flex.Item style={{flex: 5}}>
                                            <Tag small>LV.30</Tag>
                                            <WhiteSpace/>
                                            <div style={{paddingLeft:'20px'}}>7999</div>
                                            <Progress percent={40} position="normal" unfilled={true}
                                                      appearTransition/>
                                            <div style={{width:'100%',textAlign:'end',marginTop:'5px'}}>9999</div>
                                        </Flex.Item>
                                        <WingBlank/>
                                    </Flex>

                                    <div style={{textAlign: 'center'}}>昨日收益(元)</div>
                                    <div style={{textAlign: 'center'}}>980.29</div>
                                    <div style={{textAlign: 'center'}}>总资产 2,2987.67 <Icon type="check"/></div>


                                </div>

                                <div style={{backgroundColor: "#4642b0"}}>
                                    <Flex align='center'>
                                        <Flex.Item>
                                            <p style={{textAlign: 'center'}}>可用余额(元)</p>
                                            <p style={{textAlign: 'center'}}>0.00</p>
                                        </Flex.Item>
                                        <Flex.Item>
                                            <p style={{textAlign: 'center'}}>合伙人累计收益(元)</p>
                                            <p style={{textAlign: 'center'}}>0.00</p>
                                        </Flex.Item>
                                    </Flex>
                                </div>

                                <div style={{backgroundColor: "#ffffff"}}>
                                    <WingBlank>
                                        <WhiteSpace/>
                                        <Flex>
                                            <Flex.Item>
                                                <Button inline style={{
                                                    marginRight: '4px',
                                                    borderRadius: '0px',
                                                    width: '100%'
                                                }}>提现</Button>
                                            </Flex.Item>
                                            <Flex.Item>
                                                <Button inline
                                                        style={{
                                                            borderRadius: '0px',
                                                            width: '100%',
                                                        }}>充值</Button>
                                            </Flex.Item>
                                        </Flex>
                                        <WhiteSpace/>
                                    </WingBlank>
                                </div>

                                <WhiteSpace/>
                                <WingBlank>
                                    <Button
                                        inline
                                        style={{
                                            width: '100%',
                                            borderRadius: '0px',
                                            color: '#ffffff',
                                            backgroundColor: '#FCA93E'
                                        }}>
                                        加入合伙人计划
                                    </Button>
                                </WingBlank>
                                <WhiteSpace/>
                                <List className="my-list">
                                    <Item
                                        arrow="horizontal"
                                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                        onClick={() => {
                                        }}
                                    >
                                        收款日历
                                    </Item>
                                    <Item
                                        arrow="horizontal"
                                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                        onClick={() => {
                                        }}
                                    >
                                        投资项目交易记录
                                    </Item>
                                    <Item
                                        arrow="horizontal"
                                        thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"
                                        onClick={() => {
                                        }}
                                    >
                                        账户设置
                                    </Item>
                                </List>
                            </div>
                        </TabBar.Item>
                    </TabBar>
                </div>
            </div>

    );
    }
    }

    export default Home;
