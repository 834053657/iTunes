import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Row, Col, Steps, Divider } from 'antd';
import classNames from 'classnames';
import styles from './RechargeForm.less';

const FormItem = Form.Item;

class WithdrawForm extends Component {
  static defaultProps = {
    className: '',
    onGetCaptcha: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onGetCaptcha: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {};

  componentDidMount() {}

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, this.props.onSubmit);
  };

  render() {
    const { className, form, initialValue = {}, submitting, disabled } = this.props;
    const { count, current } = this.state;
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
      <div className={classNames(className, styles.form)}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="账号">
            {getFieldDecorator('user_payment_id', {
              initialValue: initialValue.email,
              rules: [
                {
                  required: true,
                  message: '请输入邮箱！',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误！',
                },
              ],
            })(<Input size="large" disabled={disabled} placeholder="邮箱" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="提现金额：">
            {getFieldDecorator('platform_payment_id', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(<Input size="large" placeholder="验证码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手续费">
            123
          </FormItem>
          <FormItem {...formItemLayout} label="输入密码">
            {getFieldDecorator('amount', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(<Input size="large" placeholder="验证码" />)}
          </FormItem>
          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              下一步
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(WithdrawForm);
