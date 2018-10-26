import React, {Component} from 'react';
import {Icon, NavBar, WhiteSpace} from "antd-mobile";

import BgUploadId from './images/bg-upload-id.png'

class UserCertification extends Component {
    render() {
        const onFaceUploadPress = () => {
            if (backRecognized && faceRecognized) {
                return;
            }
            this.refs.uploadFace.click()
        };
        const onBackUploadPress = () => {
            if (backRecognized && faceRecognized) {
                return;
            }
            this.refs.uploadBack.click()
        };

        //functions
        const {
            userCertificationPageBack,
            onFaceIDImagesChange, onBackIDImagesChange, handleRecognize
        } = this.props;

        //props
        const {
            faceImageLoaded, faceIdImageBase64Data, faceRecognized,
            backImageLoaded, backIdImageBase64Data, backRecognized
        } = this.props;

        return (
            <div style={{width: '100%'}}>
                <div className="title">
                    <NavBar
                        leftContent="我"
                        icon={<Icon type="left"/>}
                        onLeftClick={userCertificationPageBack}
                    >实名认证</NavBar>
                </div>

                <div className="content" style={{textAlign: 'center', bottom: '50px'}}>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <div style={{
                        textAlign: 'left',
                        fontSize: '12px',
                        marginBottom: '10px',
                        marginLeft: '10%'
                    }}>身份证头像面：
                    </div>
                    <img style={{width: '80%', height: '200px', backgroundColor: 'transparent'}}
                         src={faceImageLoaded ? faceIdImageBase64Data : BgUploadId} alt=""
                         onClick={onFaceUploadPress}/>
                    <WhiteSpace/>
                    <input type="button" className="reloadIdImageButton" value="重新上传"
                           style={(!faceImageLoaded || (backRecognized && faceRecognized)) ? {display: 'none'} : {}}
                           onClick={onFaceUploadPress}/>
                    <WhiteSpace/>
                    <div style={{
                        textAlign: 'left',
                        fontSize: '12px',
                        marginBottom: '10px',
                        marginLeft: '10%'
                    }}>身份证国徽面：
                    </div>
                    <img style={{width: '80%', height: '200px'}}
                         src={backImageLoaded ? backIdImageBase64Data : BgUploadId} alt=""
                         onClick={onBackUploadPress}/>
                    <WhiteSpace/>
                    <input type="button" className="reloadIdImageButton" value="重新上传"
                           style={(!backImageLoaded || (backRecognized && faceRecognized)) ? {display: 'none'} : {}}
                           onClick={onBackUploadPress}/>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <input ref="uploadFace" type="file" accept="image/*" style={{display: 'none'}}
                           onChange={onFaceIDImagesChange}/>
                    <input ref="uploadBack" type="file" accept="image/*" style={{display: 'none'}}
                           onChange={onBackIDImagesChange}/>
                </div>

                <div className="footer"
                     style={(backRecognized && faceRecognized) ? {display: 'none'} : {}}>
                    <div className="footer-button" onClick={handleRecognize}>认证
                    </div>
                </div>
            </div>
        );
    }
}

export default UserCertification;
