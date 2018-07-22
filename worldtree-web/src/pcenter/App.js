import React, {Component} from 'react';
import './App.css';
import {Flex} from "antd-mobile";
import head from './head.png'
import Util from "../utils";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // phone: '',
            // smsCode: ''
        };

        // this.handlePhoneChange = this.handlePhoneChange.bind(this);
        // this.handleSmsCodeChange = this.handleSmsCodeChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    //
    // handlePhoneChange(event) {
    //     this.setState({phone: event.target.value});
    // }
    //
    // handleSmsCodeChange(event) {
    //     this.setState({smsCode: event.target.value});
    // }
    //
    // handleSubmit(event) {
    //     alert('Phone is : ' + this.state.phone + '\nSmsCode is : ' + this.state.smsCode);
    //     event.preventDefault();
    // }

    render() {
        Util.isWeixin();

        return (
            <div>
                <Flex justify="center">
                    <img src={head} alt={""}/>
                </Flex>

                <div>
                    <h5>个人信息</h5>
                    <p><span>账号</span>11111111111</p>
                    <p><span>所在地区</span>江苏省无锡市惠山区</p>
                    <p><span>积分</span>18250</p>
                    <p><span>镇民登记</span>三星荣誉镇民</p>
                </div>


            </div>
        );
    }
}

export default App;
