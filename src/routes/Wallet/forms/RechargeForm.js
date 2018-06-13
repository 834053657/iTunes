import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Row, Col, Steps, Divider } from 'antd';
import classNames from 'classnames';
import styles from './RechargeForm.less';

const FormItem = Form.Item;

class RechargeForm extends Component {
  static defaultProps = {
    className: '',
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {};

  componentDidMount() {}

  // handleCancel = () => {
  //   this.props.form.resetFields();
  //   this.props.onCancel();
  // };

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
        sm: { span: 6 },
      },
      wrapperCol: {
        sm: { span: 18 },
      },
    };

    return (
      <div className={classNames(className, styles.form)}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="充值方式">
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
          <FormItem {...formItemLayout} label="平台账号">
            123
          </FormItem>
          <FormItem {...formItemLayout} label="账号">
            {getFieldDecorator('platform_payment_id', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(<Input size="large" placeholder="验证码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="充值金额">
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
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(RechargeForm);
