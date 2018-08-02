import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form, Input, Button, Upload, Icon, message } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import UploadQiNiu from 'components/UploadQiNiu';
import styles from './PasswordForm.less';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;

@connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class RealNameForm extends Component {
  static defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, value) => {
      if (!err) {
        const info = {
          name: value.name,
          cardno: value.cardno,
          front_image: value.front_image,
          back_image: value.back_image,
        };
        this.props.onSubmit(info);
      }
    });
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  render() {
    const { form, submitting, initialValues = {} } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="真实姓名">
            {getFieldDecorator('name', {
              initialValue: initialValues.name,
              rules: [
                {
                  required: true,
                  message: '请输入真实姓名！',
                },
              ],
            })(<Input size="large" maxLength={20} placeholder="真实姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="身份证号">
            {getFieldDecorator('cardno', {
              initialValue: initialValues.cardno,
              rules: [
                {
                  required: true,
                  message: '请输入身份证号！',
                },
              ],
            })(<Input size="large" maxLength={30} placeholder="身份证号" />)}
          </FormItem>
          <h3>上传证件</h3>

          <FormItem>
            {getFieldDecorator('front_image', {
              initialValue: initialValues.front_image,
              rules: [
                {
                  required: true,
                  message: '请上传身份证正面！',
                },
              ],
            })(<UploadQiNiu />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('back_image', {
              initialValue: initialValues.back_image,
              rules: [
                {
                  required: true,
                  message: '请上传身份证反面！',
                },
              ],
            })(<UploadQiNiu />)}
          </FormItem>

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              确定
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
