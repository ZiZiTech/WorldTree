import React, {Component} from 'react';
import './Home.css';
import {Carousel, Flex, Grid} from "antd-mobile";

import headImg from '../images/sl_01.jpg'
import showImg1 from '../images/sl_02.jpg'
import advImg from '../images/sl_03.jpg'
import productInfoImg from '../images/sl-19.png'
import buyBtnImg from '../images/sl-09.png'
import moneyIcon from '../images/sl-22.png'
import countIcon from '../images/sl-20.png'
import sl_05 from '../images/sl_05.jpg'
import sl_11 from '../images/sl-11.png'
import sl_12 from '../images/sl-12.png'
import sl_13 from '../images/sl-13.png'
import sl_14 from '../images/sl-14.png'
import sl_07 from '../images/sl_07.jpg'
import sl_08 from '../images/sl_08.jpg'
import sl_15 from '../images/sl-15.png'
import sl_16 from '../images/sl-16.png'
import sl_17 from '../images/sl-17.png'
import sl_10 from '../images/sl-10.png'
import {isWeixin} from "../utils";
import ajax from "../utils/ajax";


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            advantages: [
                {img: sl_11, title: "信息安全认证", desc: "目前世界树理财已经获得有公安部认证的国健信息安全登记保护制度第三级，确保您在世界树所有信息的保密安全"},
                {img: sl_12, title: "太平洋保险", desc: "太平洋保险将为世界树理财的网络安全提供承保赔付服务，确保您的账号信息更安全，避免遭受资金的损失"},
                {
                    img: sl_13,
                    title: "精选合作方",
                    desc: "世界树作为综合互联网金融信息推荐平台，与多家优质合规持牌机构进行合作，旨在通过严格的审核标准，为广大用户提供优质稳定、收益合理的金融产品信息"
                },
                {img: sl_14, title: "优质资产", desc: "推荐合作方优质产品，用户可借此享受更安全的理财服务，从而获取更加稳健、更多收益的投资回报"},
            ],
            imgHeight: 176,
            averageMoney: 88.8,
            averageCount: 188,
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
        // simulate img loading
        setTimeout(() => {
            this.setState({
                data: [showImg1],
            });
        }, 100);
    }

    render() {
        // isWeixin();
        return (
            <div className="App">
                <header className="App-header">

                    <img src={headImg} alt="" style={{height: '100%', width: '100%'}}/>
                </header>
                <main>
                    <Carousel
                        autoplay={false}
                        dots={false}
                        infinite
                        beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                        afterChange={index => console.log('slide to', index)}
                    >
                        {this.state.data.map(val => (
                            <a
                                key={val}
                                href=""
                                style={{display: 'inline-block', width: '100%', height: this.state.imgHeight}}
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

                    <img style={{width: '100%', height: 'auto'}} src={advImg} alt=""/>

                    <div className="productContainer">
                        <img style={{width: '100%', height: 'auto'}} src={productInfoImg} alt=""/>
                        <img onClick={this.jumpToBuy} style={{width: '90%', height: 'auto', marginTop: '16px'}}
                             src={buyBtnImg} alt=""/>
                        <p style={{color: '#976526', marginTop: '5px', fontWeight: '200'}}>理财非存款 投资需谨慎</p>

                        <Flex style={{paddingBottom: '20px'}}>
                            <Flex.Item>
                                <div>
                                    <Flex>
                                        <Flex.Item align='end'>
                                            <img style={{width: '25px', height: '25px'}} src={moneyIcon} alt=""/>
                                        </Flex.Item>
                                        <Flex.Item style={{fontSize: '20px', color: '#976526'}}>
                                            {this.state.averageMoney} 万元
                                        </Flex.Item>
                                    </Flex>
                                    <div style={{textAlign: 'center', width: '100%', color: '#858585'}}>
                                        产品平均金额
                                    </div>
                                </div>
                            </Flex.Item>
                            <Flex.Item>
                                <div>
                                    <Flex>
                                        <Flex.Item align='end'>
                                            <img style={{width: '25px', height: '25px'}} src={countIcon} alt=""/>
                                        </Flex.Item>
                                        <Flex.Item style={{fontSize: '20px', color: '#976526'}}>
                                            {this.state.averageCount} 人
                                        </Flex.Item>
                                    </Flex>
                                    <div style={{textAlign: 'center', width: '100%', color: '#858585'}}>
                                        产品平均持有人数
                                    </div>
                                </div>
                            </Flex.Item>
                        </Flex>

                    </div>

                    <div style={{background: '#FEFBF1'}}>
                        <img style={{width: '100%', height: 'auto'}} src={sl_05} alt=""/>

                        <Grid data={this.state.advantages}
                              columnNum={2}
                              hasLine={false}
                              activeStyle={false}
                              itemStyle={{height: '240px', background: '#FEFBF1'}}
                              renderItem={advantage => (
                                  <div style={{padding: '12.5px'}}>
                                      <div style={{color: '#888', fontSize: '14px', marginTop: '12px'}}>
                                          <img style={{width: '65px', height: '65px'}} src={advantage.img} alt=""/>
                                          <p style={{
                                              color: '#636363',
                                              fontSize: '1em',
                                              fontWeight: 200,
                                          }}>{advantage.title}</p>
                                          <p style={{
                                              color: '#868686',
                                              fontSize: '0.875em',
                                              fontWeight: 100,
                                              textAlign: 'left'
                                          }}>{advantage.desc}</p>
                                      </div>
                                  </div>
                              )}
                        />
                    </div>
                    <div style={{background: '#FEFFFF'}}>
                        <img style={{width: '100%', height: 'auto'}} src={sl_07} alt=""/>
                        <img style={{width: '100%', height: 'auto'}} src={sl_08} alt=""/>

                        <div className="townContainer">
                            <img style={{width: '80px', height: '80px'}} src={sl_15} alt=""/>
                            <Flex justify="center" style={{marginTop: '10px'}}>
                                <Flex.Item style={{textAlign: 'center'}}>
                                    <img style={{width: '80px', height: '80px'}} src={sl_16} alt=""/>
                                </Flex.Item>
                                <Flex.Item style={{textAlign: 'center'}}>
                                    <img style={{width: '80px', height: '80px'}} src={sl_17} alt=""/>
                                </Flex.Item>
                            </Flex>
                        </div>

                        <img onClick={this.seeDetail}
                             style={{width: '90%', height: 'auto', marginTop: '16px', paddingBottom: '40px'}}
                             src={sl_10} alt=""/>
                    </div>

                </main>

                <footer className="App-footer">
                    <Flex style={{paddingTop: '10px'}}>
                        <Flex.Item>
                            <div style={{textAlign: 'center', borderRight: '1px solid #fff'}}>首页</div>
                        </Flex.Item>
                        <Flex.Item>
                            <div style={{textAlign: 'center', borderRight: '1px solid #fff'}}>安全保障</div>
                        </Flex.Item>
                        <Flex.Item>
                            <div style={{textAlign: 'center', borderRight: '1px solid #fff'}}>帮助中心</div>
                        </Flex.Item>
                        <Flex.Item>
                            <div style={{textAlign: 'center'}}>注册登录</div>
                        </Flex.Item>
                    </Flex>
                </footer>
            </div>
        );
    }
}

export default Home;
