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
        'onb47_1uVKhYASIOfAaGwTGYIfjkL8K3TiDxwk_g:MpJD3XIu-wYWEjleDqEwn5Iyv64=:eyJkZWFkbGluZSI6MTUyOTUwODc2Miwic2NvcGUiOiJpbWFnZXMifQ==',
    };
    this.previewUrl = 'http://images.91jianke.com/';
  }

  fileChange = info => {
    this.previewUrl = 'http://images.91jianke.com/';
    const file = info.file;
    const id = file.response.hash;
    const m = {
      uid: file.uid,
      name: file.name,
      status: file.status,
      url: this.previewUrl + file.resopnse,
    };
    this.previewUrl += id;
    this.props.getUrl ? this.props.getUrl(this.previewUrl) : null;
    this.props.onlyPic ? this.props.onlyPic(this.previewUrl) : null;
    this.props.appealPic ? this.props.appealPic(info) : null;
  };

  componentWillMount() {
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

  uploadHandler = info => {
    const { upload } = this.props.currentUser || {};
    console.log(info);

    if (info.file.status === 'uploading') {
      this.setState({
        uploadLoading: true,
      });
    } else if (info.file.status === 'done') {
      console.log(info);
      // const url = upload.prefix + info.file.response.hash;

      // self.fileChange(info);
      // self.setState({ fileList: [...info.fileList] });
      // this.props.dispatch({
      //   type: 'user/submitChangeAvatar',
      //   payload: {
      //     avatar,
      //   },
      //   callback: () => {
      //     message.success('修改头像成功');
      //     this.setState({ uploadLoading: false });
      //   },
      // });
      this.fileChange(info);
    } else if (info.file.status === 'error') {
      this.setState({ uploadLoading: false });
      message.error('上传错误，可能请求已过期，请刷新页面重试');
    }
    this.setState({
      fileList: info.fileList,
    });
  };

  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('头像必须小于2!');
    }
    return isLt2M;
  };

  render() {
    const { currentUser } = this.props.user || {};
    const { user = {}, upload = {} } = currentUser || {};
    const { item, index } = this.props;
    const { picNum } = this.props;
    const self = this;
    // const uploadProp = {
    //   name: 'file',
    //   action: 'http://up-z2.qiniu.com/',
    //   listType: 'picture-card',
    //   headers: {
    //     authorization: 'authorization-text',
    //   },
    //   multiple:true,
    //   onPreview: self.handlePreview,
    //   fileList: this.state.fileList,
    //   data: { token },
    //   onChange(info) {
    //     if (info.file.status === 'done') {
    //       self.fileChange(info);
    //       message.success(`${info.file.name} 上传成功`);
    //     } else if (info.file.status === 'error') {
    //       message.error(`${info.file.name} file upload failed.`);
    //     }
    //     self.setState({ fileList: [...info.fileList] });
    //   },
    //   onRemove(info) {
    //     console.log(info);
    //     console.log('info in remove');
    //     self.props.remove ? self.props.remove(info) : null;
    //   },
    // };

    return (
      <div className={styles.upload}>
        <div className={styles.right}>
          <div className={styles.addBtn}>
            <Upload
              name="file"
              accept="image/*"
              listType="picture-card"
              beforeUpload={this.beforeUpload}
              fileList={this.state.fileList}
              onPreview={self.handlePreview}
              action={upload.domain}
              onChange={this.uploadHandler}
              data={{ token: upload.token }}
            >
              {this.state.fileList.length < picNum ? (
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">上传</div>
                </div>
              ) : null}
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
