import React, {Component} from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phone: '',
            smsCode: ''
        };

        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleSmsCodeChange = this.handleSmsCodeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePhoneChange(event) {
        this.setState({phone: event.target.value});
    }

    handleSmsCodeChange(event) {
        this.setState({smsCode: event.target.value});
    }

    handleSubmit(event) {
        alert('Phone is : ' + this.state.phone + '\nSmsCode is : ' + this.state.smsCode);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    手机号：
                    <input type="text" value={this.state.phone} onChange={this.handlePhoneChange}/>
                </label>
                <label>
                    验证码：
                    <input type="text" value={this.state.smsCode} onChange={this.handleSmsCodeChange}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}

export default App;
