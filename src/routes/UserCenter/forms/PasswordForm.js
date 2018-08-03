import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { FormattedMessage as FM } from 'react-intl';

import { Form, Input, Button, Popover, Progress } from 'antd';
import styles from './PasswordForm.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}><FM id="PassWordForm.change_pwd_strong" defaultMessage="强度：强" /></div>,
  pass: <div className={styles.warning}><FM id="PassWordForm.change_pwd_center" defaultMessage="强度：中" /></div>,
  poor: <div className={styles.error}><FM id="PassWordForm.change_pwd_short" defaultMessage="强度：太短" /></div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ user, loading }) => ({
  result: user.changePassword.result,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class PasswordForm extends Component {
  static defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, this.props.onSubmit);
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(<FM id="PassWordForm.not_right" defaultMessage="两次输入的密码不匹配!" />);
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: <FM id="PassWordForm.passWord_input" defaultMessage="请输入密码！" />,
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
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
          <FormItem {...formItemLayout} label={<FM id="PassWordForm.passWord_old" defaultMessage="旧密码" />}>
            {getFieldDecorator('old_password', {
              rules: [
                {
                  required: true,
                  message: <FM id="PassWordForm.passWord_old_input" defaultMessage="请输入旧密码！" />,
                },
              ],
            })(<Input size="large" type="password" placeholder={PROMPT('PassWordForm.passWord_old_holder')} />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<FM id="PassWordForm.passWord_new" defaultMessage="新密码" />} help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FM id="PassWordForm.pwd_input_limit" defaultMessage="请输入6 ~ 16 个字符。请不要使用容易被猜到的密码。" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: <FM id="PassWordForm.pwd_input_new" defaultMessage="请输入新密码！" />,
                  },
                  {
                    min: 6,
                    message: <FM id="PassWordForm.pwd_input_minWord" defaultMessage="请输入至少6位字符！" />,
                  },
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  maxLength={16}
                  placeholder={(PROMPT('PassWordForm.pwd_input_minWd'))}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem {...formItemLayout} label={<FM id="PassWordForm.pwd_again_require" defaultMessage="确认密码" />}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: <FM id="PassWordForm.msg_require_affirm" defaultMessage="请确认密码！" />,
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder={(PROMPT('PassWordForm.msg_require_affirm'))} />)}
          </FormItem>

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              <FM id="PassWordForm.cancel" defaultMessage="取消" />
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              <FM id="PassWordForm.nextStep" defaultMessage="下一步" />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
