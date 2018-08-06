import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress, message } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import ImageValidation from 'components/ImageValidation';
import styles from './Register.less';
import { getCaptcha } from '../../services/api';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}><FM id='UserLogin.sign_word_strong' defaultMessage='强度：强' /></div>,
  pass: <div className={styles.warning}><FM id='UserLogin.sign_word_center' defaultMessage='强度：中' /></div>,
  poor: <div className={styles.error}><FM id='UserLogin.sign_word_lower' defaultMessage='强度：太短' /></div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    imageValidationVisible: false,
    help: '',
    image: '',
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  showImageValidationModal = () => {
    this.props.form.validateFieldsAndScroll(['email'], {}, (err, values) => {
      if (!err) {
        this.setState({
          imageValidationVisible: true,
        });
      }
    });
  };

  onGetCaptcha = (err, code, loadCaptcha) => {
    const { form } = this.props;
    const mail = form.getFieldValue('email');
    if (!err) {
      this.props.dispatch({
        type: 'register/sendVerify',
        payload: {
          code,
          data: {
            mail,
          },
          type: 'mail',
          usage: 1,
        },
        callback: res => {
          if (res.code === 0) {
            let count = 59;
            this.setState({ count, imageValidationVisible: false });
            this.interval = setInterval(() => {
              count -= 1;
              this.setState({ count });
              if (count === 0) {
                clearInterval(this.interval);
              }
            }, 1000);
          } else {
            loadCaptcha();
            message.error(res.msg);
          }
        },
      });
    }
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
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(PROMPT('UserLogin.sign_word_notRight')||'两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: <FM id='UserLogin.sign_word_input' defaultMessage='请输入密码！' />,
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

  loadCaptcha = async () => {
    const params = {
      r: Math.random(),
      usage: 'login',
    };
    const res = await getCaptcha(params);
    if (res.data) {
      this.setState({
        image: res.data.img,
      });
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

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, image, imageValidationVisible } = this.state;
    return (
      <div className={styles.main}>
        <h3><FM id='UserLogin.sign_user_title' defaultMessage='注册' /></h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: <FM id='UserLogin.sign_word_input_email' defaultMessage='请输入邮箱地址！' />,
                },
                {
                  type: 'email',
                  message: <FM id='UserLogin.sign_word_error_type' defaultMessage='邮箱地址格式错误！' />,
                },
              ],
            })(<Input size="large" placeholder={(PROMPT('UserLogin.login_userEmail')||'邮箱')} />)}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('verify_code', {
                  rules: [
                    {
                      required: true,
                      message: <FM id='UserLogin.sign_code_input_' defaultMessage='请输入验证码！' />,
                    },
                  ],
                })(<Input size="large" placeholder={(PROMPT("loginItem.sign_input_code" || "验证码"))} />)}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.showImageValidationModal}
                >
                  {count ? `${count} s` : (PROMPT("loginItem.get_code_login" || "获取验证码"))}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: <FM id='UserLogin.sign_input_userName' defaultMessage='请输入用户名！' />,
                },
                // {
                //   min: 2,
                //   message: '请输入至少2位字符！',
                // },
                // {
                //   max: 20,
                //   message: '请输入最多20位字符！',
                // },
                {
                 // pattern: /^[\u4E00-\u9FA5_a-zA-Z0-9/-]{2,20}$/,
                  pattern: /^[a-zA-Z0-9_-]{2,20}$/,
                  message: <FM id='UserLogin.sign_userName_limit' defaultMessage='用户名只能是2~20位字母，数字，下划线，减号' />,
                },
              ],
            })(<Input size="large" placeholder={(PROMPT('UserLogin.userName_inp_lim')||'用户名 2-20位')} />)}
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FM id='UserLogin.sign_word_num_limit' defaultMessage='请输入6 ~ 16 个字符。请不要使用容易被猜到的密码。' />
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
                    validator: this.checkPassword,
                  },
                  {
                    min: 6,
                    message: <FM id='UserLogin.sign_word_min_inp' defaultMessage='请输入至少6位字符！' />,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  maxLength={16}
                  placeholder={(PROMPT('UserLogin.sign_letter')||'6~16位密码，区分大小写')}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: <FM id='UserLogin.sign_word_again_' defaultMessage='请确认密码！' />,
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder={(PROMPT('UserLogin.resign_passWord')||"确认密码")} />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('invite_code', {
              rules: [
                {
                  required: true,
                  message: <FM id='UserLogin.sign_input_Invitation' defaultMessage='请输入邀请码！' />,
                },
              ],
            })(<Input size="large" placeholder={(PROMPT('UserLogin.sign_Invitation')||'邀请码')} />)}
          </FormItem>

          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FM id='UserLogin.sign_btn_' defaultMessage='注册' />
            </Button>
            <Link className={styles.login} to="/user/login">
              <FM id='UserLogin.sign_old_account_' defaultMessage='使用已有账户登录' />
            </Link>
          </FormItem>
        </Form>
        <ImageValidation
          title={<FM id='UserLogin.sign_safe_check_user' defaultMessage='安全验证' />}
          onCancel={() => {
            this.setState({ imageValidationVisible: false });
          }}
          onSubmit={this.onGetCaptcha}
          visible={imageValidationVisible}
        />
      </div>
    );
  }
}
