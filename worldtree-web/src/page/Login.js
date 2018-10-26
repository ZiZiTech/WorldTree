import React, {Component} from 'react';
import {Icon, NavBar} from "antd-mobile";
import CodeBox from "../compont/CodeBox"

class Login extends Component {
    render() {
        //functions
        const {pageBack, onTelChange, onSmsCodeChange, nextStep, getSmsCode, login} = this.props;

        //props
        const {showCode, phoneIsCorrect, secondsElapsed, smsRequestInterval, smsCodeIsCorrect} = this.props;

        return (
            <div style={{
                width: '100%',
                textAlign: 'center',
            }}>
                <NavBar
                    icon={<Icon type="left"/>}
                    onLeftClick={pageBack}
                >大衍金融</NavBar>

                <div style={showCode ? {display: 'none'} : {
                    width: '100%', marginTop: '100px'
                }}>
                    <CodeBox
                        type="tel"
                        length={11}
                        validator={(input, index) => {
                            return /\d/.test(input);
                        }}
                        onChange={onTelChange}
                    />

                    <p style={{marginTop: '10px', marginBottom: '80px'}}>请填写手机号</p>

                    <input type="button" className="invitationCodeButton" value="下一步"
                           disabled={phoneIsCorrect ? '' : 'disabled'} onClick={nextStep}/>

                </div>

                <div style={showCode ? {textAlign: 'center', marginTop: '100px'} : {display: 'none'}}>
                    <CodeBox
                        type="tel"
                        length={6}
                        validator={(input, index) => {
                            return /\d/.test(input);
                        }}
                        onChange={onSmsCodeChange}
                    />
                    <p style={{marginTop: '10px', marginBottom: '10px'}}>请填写验证码</p>

                    <p onClick={getSmsCode}>{secondsElapsed === smsRequestInterval ? "重新发送" : "剩余" + secondsElapsed + "秒"}</p>

                    <input
                        type="button"
                        className="invitationCodeButton"
                        value="登录"
                        disabled={smsCodeIsCorrect ? '' : 'disabled'}
                        style={{marginBottom: '80px'}}
                        onClick={login}/>
                </div>
            </div>
        );
    }
}

export default Login;
