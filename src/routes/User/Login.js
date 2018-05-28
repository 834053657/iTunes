import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import G2Validation from 'components/G2Validation';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, ImgCaptcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    g2Visible: false,
    // autoLogin: true,
    image: '',
  };

  componentDidMount() {
    this.loadCaptcha();
  }

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  loadCaptcha = () => {
    const isDev = process.env.NODE_ENV === 'development';
    this.setState({
      image: `${!isDev ? CONFIG.base_url : ''}/itunes/user/captcha?r=${Math.random()}`,
    });
  };

  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  handleSubmitG2 = (err, v) => {
    console.log(v);
  };

  handleCancel = () => {
    this.setState({
      g2Visible: false,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render2faValidation = () => {
    this.setState({
      g2Visible: true,
    });
  };

  render() {
    const { login, submitting } = this.props;
    const { type, image, g2Visible } = this.state;
    return (
      <div className={styles.main}>
        <h3>登录</h3>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          {/*<Tab key="account" tab="账户密码登录">*/}
          {login.status === 'error' &&
            login.type === 'account' &&
            !login.submitting &&
            this.renderMessage('账户或密码错误（admin/888888）')}
          <UserName name="account" placeholder="用户名或邮箱" />
          <Password name="password" placeholder="密码" />
          <ImgCaptcha
            name="captcha"
            placeholder="验证码"
            image={image}
            onClick={this.loadCaptcha}
          />
          {/*</Tab>*/}
          {/* <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab>*/}
          <div>
            {/*<Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>*/}
            <Icon className={styles.icon} type="alipay-circle" onClick={this.render2faValidation} />
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link to="/user/forget-password">忘记密码?</Link>
            {/* 其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />*/}
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login>

        <G2Validation
          title="安全验证"
          visible={g2Visible}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmitG2}
        />
      </div>
    );
  }
}
