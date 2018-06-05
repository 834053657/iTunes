import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form, Input, Button, Popover, Progress } from 'antd';
import styles from './PasswordForm.less';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  result: user.changePassword.result,
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
    this.props.form.validateFields({ force: true }, this.props.onSubmit);
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  render() {
    const { form, submitting } = this.props;
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
              rules: [
                {
                  required: true,
                  message: '请输入真实姓名！',
                },
              ],
            })(<Input size="large" placeholder="真实姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="身份证号">
            {getFieldDecorator('cardno', {
              rules: [
                {
                  required: true,
                  message: '请输入身份证号！',
                },
              ],
            })(<Input size="large" placeholder="身份证号" />)}
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
