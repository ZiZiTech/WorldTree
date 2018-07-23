import React, {Component} from 'react';
import './Login.css';
import {Button, InputItem, List, WhiteSpace, WingBlank} from "antd-mobile";

import {ValidateMobile, Trim,isWeixin} from '../utils'

const smsRequestInterval = 60;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openId: 'test_open_id',
            phone: '',
            smsCode: '',
            secondsElapsed: smsRequestInterval,
        };

        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleSmsCodeChange = this.handleSmsCodeChange.bind(this);
        this.getSmsCode = this.getSmsCode.bind(this);
        this.tick = this.tick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnMount() {
        clearInterval(this.interval);
        this.interval = null;
    }

    tick() {
        if (this.state.secondsElapsed > 0) {
            this.setState((prevState) => ({
                secondsElapsed: prevState.secondsElapsed - 1
            }));
            if (!this.interval) {
                this.interval = setInterval(() => this.tick(), 1000);
            }
        } else {
            clearInterval(this.interval);
            this.interval = null;
            this.setState((prevState) => ({
                secondsElapsed: smsRequestInterval
            }));
        }
    }

    getSmsCode() {
        //判断手机号是否合法
        if (ValidateMobile(Trim(this.state.phone, 'g'))) {

            this.tick();

            // const urlSmsCodeGet = 'smscode/get/' + this.state.phoneNumber;
            //
            // HttpRequest_Post(
            //     urlSmsCodeGet,
            //     null,
            //     function (data) {
            //         if (data.code === 1){
            //             alert("短信已发送")
            //         }else{
            //             alert("获取失败，请重试")
            //         }
            //     },
            //     function (data) {
            //         alert(data.message);
            //     }
            // );
        }
    }

    handlePhoneChange(value) {
        this.setState({phone: value});
    }

    handleSmsCodeChange(value) {
        this.setState({smsCode: value});
    }

    handleSubmit() {
        alert('Phone is : ' + this.state.phone + '\nSmsCode is : ' + this.state.smsCode);
    }

    render() {
        isWeixin();
        const {secondsElapsed} = this.state;
        return (
            <div>
                <header className="App-header">
                    登录
                </header>
                <WingBlank>
                    <List style={{marginTop: '60px'}}>
                        <InputItem
                            clear
                            type="phone"
                            placeholder="手机号"
                            value={this.state.phone}
                            onChange={this.handlePhoneChange}
                        >手机号</InputItem>

                        <InputItem
                            clear
                            type="number"
                            maxLength="6"
                            placeholder="验证码"
                            extra={<Button type="primary" size="small"
                                           inline
                                           disabled={!(secondsElapsed === smsRequestInterval)}
                                           onClick={this.getSmsCode}>{secondsElapsed === smsRequestInterval ? "发送" : "剩余" + secondsElapsed + "秒"}</Button>}
                            value={this.state.smsCode}
                            onChange={this.handleSmsCodeChange}
                        >验证码</InputItem>
                    </List><WhiteSpace/>

                    <Button type="primary" onClick={this.handleSubmit}>登录</Button><WhiteSpace/>
                </WingBlank>
            </div>

        );
    }
}

export default Login;
