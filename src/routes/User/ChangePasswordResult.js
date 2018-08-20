import React, { Component, Fragment } from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import Result from 'components/Result';
import styles from './RegisterResult.less';

const msg = defineMessages({
  goSign: {
    id: 'ChangePasswordResult.goSign',
    defaultMessage: '去登录',
  },
  goback: {
    id: 'ChangePasswordResult.goback',
    defaultMessage: '返回首页',
  },
  changeSuccess: {
    id: 'ChangePasswordResult.changeSuccess',
    defaultMessage: '密码修改成功',
  },
});

export default class ChangePasswordResult extends Component{

  actions = (
    <div className={styles.actions}>
      <Link to="/user/login">
        <Button size="large" type="primary">
          {INTL(msg.goSign)}
        </Button>
      </Link>
      <Link to="/">
        <Button size="large">{INTL(msg.goback)}</Button>
      </Link>
    </div>
  );

  render(){
    return (
      <Result
        className={styles.registerResult}
        type="success"
        title={<div className={styles.title}>{INTL(msg.changeSuccess)}</div>}
        actions={this.actions}
        style={{ marginTop: 56 }}
      />
    );
  }

};
