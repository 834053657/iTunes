import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import { FormattedMessage as FM, defineMessages } from 'react-intl';
import Login from 'components/Login';
import {injectIntl } from 'components/_utils/decorator';
import G2Validation from 'components/G2Validation';
import { getCaptcha } from '../../services/api';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, ImgCaptcha, Submit } = Login;

const msg = defineMessages({
  account: {
    id: 'UserLogin.login_emailOrUser',
    defaultMessage: '用户名或邮箱',
  },
  login_passWord: {
    id: 'UserLogin.login_passWord',
    defaultMessage: '密码',
  },
  login_code: {
    id: 'UserLogin.login_code',
    defaultMessage: '验证码',
  }
});

@injectIntl()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    image: '',
  };

  componentDidMount() {
    this.loadCaptcha();
  }

  handleSubmit = async (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
        callback: res => {
          if (res.code !== 0 ) { // && res.code < 1000
            this.loadCaptcha();
          }
        },
      });
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

  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  handleSubmitG2 = (err, values) => {
    if (!err) {
      const { loginInfo } = this.props.login;
      delete loginInfo.captcha;
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...loginInfo,
          g2fa_code: values.code,
        },
      });
    }
  };

  handleCancel = () => {
    this.props.dispatch({
      type: 'login/changeLoginStatus',
      payload: {
        g2Visible: false,
      },
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting, intl } = this.props;
    const { image } = this.state;

    return (
      <div className={styles.main}>
        {/*登录*/}
        <h3><FM id='UserLogin.login_' defaultMessage='登录' /></h3>
        <Login onSubmit={this.handleSubmit}>
          {login.error && this.renderMessage(login.error)}
          {/*邮箱*/}
          {/*<UserName name="account" placeholder={(PROMPT('UserLogin.login_emailOrUser')||'用户名或邮箱')} />*/}
          <UserName name="account" placeholder={intl.formatMessage(msg.account)} />
          {/*密码*/}
          <Password name="password" placeholder={intl.formatMessage(msg.login_passWord)} />
          <ImgCaptcha
            name="captcha"
            // 验证码
            placeholder={intl.formatMessage(msg.login_code)}
            image={image}
            loadCaptcha={this.loadCaptcha}
          />
          <Submit loading={submitting}><FM id='UserLogin.login_submit' defaultMessage='登录' /></Submit>
          <div className={styles.other}>
            <Link to="/user/forget-password"><FM id='UserLogin.login_forget_passWord' defaultMessage='忘记密码?' /></Link>
            <Link className={styles.register} to="/user/register">
              <FM id='UserLogin.login_account_sign' defaultMessage='注册账户' />
            </Link>
          </div>
        </Login>

        <G2Validation
          title={<FM id='UserLogin.login_safe_check' defaultMessage='安全验证' />}
          visible={login.g2Visible}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmitG2}
        />
      </div>
    );
  }
}
