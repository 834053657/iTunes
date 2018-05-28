import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './ForgetPassword.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect(({ user, loading }) => ({
  result: user.forgetPassword,
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

  componentWillReceiveProps(nextProps) {
    const account = this.props.form.getFieldValue('mail');
    if (nextProps.result && nextProps.result.token) {
      this.props.dispatch(
        routerRedux.push({
          pathname: '/user/register-result',
          state: {
            account,
          },
        })
      );
    }
  }

  componentWillUnmount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'user/submitForgetPassword',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  loadCaptcha = () => {
    const isDev = process.env.NODE_ENV === 'development';
    this.setState({
      image: `${!isDev ? CONFIG.base_url : ''}/itunes/user/captcha?r=${Math.random()}`,
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { image } = this.state;
    return (
      <div className={styles.main}>
        <h3>忘记密码</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('mail', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱地址！',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误！',
                },
              ],
            })(<Input size="large" placeholder="邮箱" />)}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ],
                })(<Input size="large" placeholder="验证码" />)}
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
              发送
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}
