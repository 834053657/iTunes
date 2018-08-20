import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { FormattedMessage as FM, defineMessages } from 'react-intl';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import {injectIntl } from 'components/_utils/decorator';

import styles from './ChangePassword.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const msg = defineMessages({
  change_pwd_wordLimit_title: {
    id: 'changePassWord.change_pwd_wordLimit_title',
    defaultMessage: '至少6位密码，区分大小写',
  },
  require_passWord_again: {
    id: 'changePassWord.require_passWord_again',
    defaultMessage: '请确认密码',
  },
  pwd_error: {
    id: 'changePassWord.pwd_error',
    defaultMessage: '两次输入的密码不匹配!',
  },
  help: {
    id: 'changePassWord.help',
    defaultMessage: '请输入密码！',
  },
});

@injectIntl()
@connect(({ user, loading }) => ({
  result: user.changePassword.result,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('new_password');
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
    const { params: { code } } = this.props.match || {};
    this.props.form.validateFields({ force: true }, (err, values) => {
      console.log(values);
      if (!err) {
        this.props.dispatch({
          type: 'user/submitChangePassword',
          payload: {
            ...values,
            code,
          },
        });
      }
    });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('new_password')) {
      callback(INTL(msg.pwd_error));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: INTL(msg.help),
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
    const value = form.getFieldValue('new_password');
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

  render() {
    const { form, submitting, intl } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h3><FM id="changePassWord.change_pwd" defaultMessage="修改密码" /></h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FM id="changePassWord.change_pwd_limit" defaultMessage="请输入6 ~ 16 个字符。请不要使用容易被猜到的密码。" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('new_password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                  {
                    min: 6,
                    message: <FM id="changePassWord.change_pwd_wordLimit" defaultMessage="请输入至少6位字符！" />,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  maxLength={16}
                  placeholder={intl.formatMessage(msg.change_pwd_wordLimit_title)}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: <FM id="changePassWord.require_passWord" defaultMessage="请确认密码！" />,
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder={intl.formatMessage(msg.require_passWord_again)} />)}
            {/*确认密码*/}
          </FormItem>

          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FM id="changePassWord.submit_" defaultMessage="提交" />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
