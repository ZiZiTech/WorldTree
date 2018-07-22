import React, {Component} from 'react';
import './App.css';
import {Carousel, Flex} from "antd-mobile";

import headImg from '../images/sl_01.jpg'
import showImg1 from '../images/sl_02.jpg'
import advImg from '../images/sl_03.jpg'
import productInfoImg from '../images/sl-19.png'
import buyBtnImg from '../images/sl-09.png'
import moneyIcon from '../images/sl-22.png'
import countIcon from '../images/sl-20.png'

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            advantages: [{t1: "精选合作方", t2: "合规持牌机构"}, {t1: "优质资产", t2: "严格审核标准"}],
            imgHeight: 176,
            averageMoney: 88.8,
            averageCount: 188,
        };

        this.jumpToBuy = this.jumpToBuy.bind(this);

    }

    jumpToBuy() {
        alert('jumpToBuy');
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
                        {/*<Grid data={this.state.advantages}*/}
                        {/*columnNum={2}*/}
                        {/*itemStyle={{height: '100px', background: 'transparent'}}*/}
                        {/*renderItem={advantage => (*/}
                        {/*<div style={{padding: '12.5px'}}>*/}
                        {/*<div style={{color: '#888', fontSize: '14px', marginTop: '12px'}}>*/}
                        {/*<span>{advantage.t1}</span>*/}
                        {/*<span>{advantage.t2}</span>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*)}*/}
                        {/*/>*/}
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

export default App;
