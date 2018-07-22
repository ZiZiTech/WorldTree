import React, { PureComponent } from 'react';
import {Button} from "antd-mobile";


class TopBar extends PureComponent {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    <Button>Start</Button>
                    <Button>Start</Button>
                    <Button>Start</Button>
                    <Button>Start</Button>
                    <Button>Start</Button>
                    <Button>Start</Button>
                    <Button>Start</Button>
                    <Button>Start</Button>
                    <Button>Start</Button>

                </p>
            </div>
        );
    }
}

export default TopBar;
