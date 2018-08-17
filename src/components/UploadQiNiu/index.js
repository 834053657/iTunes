import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, message, Spin } from 'antd';
import { FormattedMessage as FM ,defineMessages} from 'react-intl';
import { delay, map } from 'lodash';
import {injectIntl } from 'components/_utils/decorator';
import { getAuthority } from '../../utils/authority';
import styles from './index.less';

const Dragger = Upload.Dragger;

const msg = defineMessages({
  error1: {
    id: 'uploadQiNiu.error1',
    defaultMessage: '上传错误，可能请求已过期，请刷新页面重试',
  },
  error2: {
    id: 'uploadQiNiu.error2',
    defaultMessage: '文件格式不对，gif、png、jpg、jpeg、或bmp文件。',
  },
  error3: {
    id: 'uploadQiNiu.error3',
    defaultMessage: '图片必须小于5M!',
  }
});

@injectIntl()
export default class UploadQiNiu extends Component {
  state = {
    uploading: false,
  };

  getImgUrl = (obj = {}) => {
    const { upload = {} } = getAuthority() || {};

    let url = '';
    if (obj.status === 'done' && obj.url) {
      url = obj.url;
    } else if (obj.status === 'done' && obj.response) {
      url = obj.response.hash;
    }
    return url ? upload.prefix + url : null;
  };

  uploadHandler = info => {
    if (info.file.status === 'uploading') {
      this.setState({
        uploading: true,
      });
    } else if (info.file.status === 'done') {
      const url = this.getImgUrl(info.file);
      this.props.onChange(url);
      this.setState({ uploading: false });
    } else if (info.file.status === 'error') {
      this.setState({ uploading: false });
      message.error(this.props.intl.formatMessage(msg.error1));
    }
  };

  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error(this.props.intl.formatMessage(msg.error3));
    }
    const fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
    if (['gif', 'png', 'jpg', 'jpeg', 'bmp'].indexOf(fileExt) < 0) {
      message.error(this.props.intl.formatMessage(msg.error2));
      return false;
    }
    return isLt2M;
  };

  render() {
    const { value } = this.props;
    const { upload = {} } = getAuthority() || {};

    const uploadButton = (
      <div>
        <p className="ant-upload-drag-icon">
          <Icon type={this.state.uploading ? 'loading' : 'inbox'} />
        </p>
        <p className="ant-upload-text"><FM id="index.click_files" defaultMessage="单击或拖动文件到此区域进行上传" /></p>
      </div>
    );

    return (
      <Spin spinning={this.state.uploading}>
        <Dragger
          name="file"
          accept="image/gif, image/png, image/jpg, image/jpeg, image/bmp"
          showUploadList={false}
          multiple={false}
          action={upload.domain}
          onChange={this.uploadHandler}
          beforeUpload={this.beforeUpload}
          data={{ token: upload.token }}
          disabled={this.props.disabled}
        >
          {value ? (
            <img style={{ maxWidth: '100%', maxHeight: '150px' }} src={value} alt="qrcode" />
          ) : (
            uploadButton
          )}
        </Dragger>
      </Spin>
    );
  }
}
