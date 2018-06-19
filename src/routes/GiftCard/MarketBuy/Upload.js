import React, { Component } from 'react';
import { connect } from 'dva/index';

import { Modal, Input, Button, Icon, Upload, message, Popover } from 'antd';
import styles from '../SellCard.less';

@connect(({ global, card, user }) => ({
  user,
  card,
  global,
}))
export default class UploadComponent extends Component {
  constructor(props) {
    super();
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      token:
        'onb47_1uVKhYASIOfAaGwTGYIfjkL8K3TiDxwk_g:iOPowb3L9SfQ6b932TmAP88E_V0=:eyJkZWFkbGluZSI6MTUyOTM4MjkzMSwic2NvcGUiOiJpbWFnZXMifQ==',
    };
    this.previewUrl = 'http://images.91jianke.com/';
  }

  fileChange = info => {
    console.log(info);
    const file = info.file;
    const m = {
      uid: file.uid,
      name: file.name,
      status: file.status,
      url: this.previewUrl + file.resopnse,
    };
  };

  componentWillMount() {
    console.log(this.props.user);

    this.props
      .dispatch({
        type: 'global/fetchConfigs',
      })
      .then(() => {});
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };
  handleCancel = () => this.setState({ previewVisible: false });

  render() {
    const { item, index, getToken } = this.props;

    const self = this;
    const uploadProp = {
      name: 'file',
      action: 'http://up-z2.qiniu.com/',
      listType: 'picture-card',
      headers: {
        authorization: 'authorization-text',
      },
      onPreview: self.handlePreview,
      fileList: this.state.fileList,
      data: { token: this.state.token },
      onChange(info) {
        if (info.file.status === 'done') {
          self.fileChange(info);
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
        self.setState({ fileList: [...info.fileList] });
      },
    };

    return (
      <div className={styles.upload}>
        <div className={styles.right}>
          <div className={styles.addBtn}>
            <Upload {...uploadProp}>
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
              </div>
            </Upload>
            <Modal visible={self.state.previewVisible} footer={null} onCancel={self.handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={self.state.previewImage} />
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
