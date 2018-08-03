import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import styles from './ForgetPassword.less';
import { getCaptcha } from '../../services/api';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect(({ user, loading }) => ({
  submitting: loading.effects['user/submitForgetPassword'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    image: '',
  };

  componentDidMount() {
    this.loadCaptcha();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'user/submitForgetPassword',
          payload: {
            ...values,
          },
          callback: this.loadCaptcha,
        });
      }
    });
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

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { image } = this.state;
    return (
      <div className={styles.main}>
        <h3><FM id='UserLogin.forget_passWord' defaultMessage='忘记密码' /></h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: <FM id='UserLogin.forget_email_' defaultMessage='请输入邮箱地址！' />,
                },
                {
                  type: 'email',
                  message: <FM id='UserLogin.forget_email_error' defaultMessage='邮箱地址格式错误！' />,
                },
              ],
            })(<Input size="large" placeholder={(PROMPT('UserLogin.login_email')||'邮箱')} />)}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: <FM id='UserLogin.forget_input_code' defaultMessage='请输入验证码！' />,
                    },
                  ],
                })(<Input size="large" placeholder={(PROMPT('UserLogin.forget_code_')||'验证码')} />)}
              </Col>
              <Col span={8}>
                <img
                  alt="captcha"
                  src={image}
                  onClick={this.loadCaptcha}
                  className={styles.captcha}
                />
              </Col>
            </Row>
          </FormItem>

          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FM id='UserLogin.forget_send_code' defaultMessage='发送' />
            </Button>
            <Link className={styles.login} to="/user/login">
              <FM id='UserLogin.forget_login_account' defaultMessage='使用已有账户登录' />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}
