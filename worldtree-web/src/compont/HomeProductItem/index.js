import React, {PureComponent} from 'react';
import {Flex} from "antd-mobile";

const imageUrl = 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  40px 40px no-repeat';

class HomeProductItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            title: 'titletitletitletitletitletitle',
            tags: ['标签1', '标签2'],
            creator: '无锡政府网',
            images: [1,1,1,1],
        };

    }


    getTags() {
        const tagContent = this.state.tags.map(function (tag, index) {
            return '';
        });
        return (
            <div>
                {tagContent}
            </div>
        )
    };

    getItemContext() {
        const imageCount = this.props.images.length;
        let itemContext;
        if (imageCount === 0) {
            itemContext =
                <div>
                    {this.state.title}
                </div>;
        } else if (imageCount === 1) {
            itemContext =
                <Flex>
                    <Flex.Item style={{flex: 3}}>{this.state.title}</Flex.Item>
                    <Flex.Item style={{flex: 1}}><img style={{width: '20%', height: 'auto'}} src={imageUrl} alt=""/></Flex.Item>
                </Flex>

        } else {
            itemContext =
                <div>
                    <div>{this.state.title}</div>
                    <Flex>
                        <Flex.Item><img style={{width: '20%', height: 'auto'}} src={imageUrl} alt=""/></Flex.Item>
                        <Flex.Item><img style={{width: '20%', height: 'auto'}} src={imageUrl} alt=""/></Flex.Item>
                        <Flex.Item><img style={{width: '20%', height: 'auto'}} src={imageUrl} alt=""/></Flex.Item>
                    </Flex>
                </div>
        }

        return itemContext;
    }

    render() {
        return (
            <div>
                {this.getItemContext()}
                <div>
                    {this.getTags()} {this.state.creator}
                </div>
            </div>
        );
    }
}

export default HomeProductItem;
