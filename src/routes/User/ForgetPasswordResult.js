import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import {defineMessages} from 'react-intl';
import Result from 'components/Result';
import styles from './RegisterResult.less';


const msg = defineMessages({
  go_back: {
    id: 'ForgetPasswoordResult.go_back',
    defaultMessage: '返回首页',
  },
  send_msg: {
    id: 'ForgetPasswoordResult.send_msg',
    defaultMessage: '重置密码邮件发送成功',
  },
  replace_pwd: {
    id: 'ForgetPasswoordResult.replace_pwd',
    defaultMessage: '重置邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接重置密码。',
  },
});
const actions = (
  <div className={styles.actions}>
    <Link to="/">
      <Button size="large">{INTL(msg.go_back)}</Button>
    </Link>
  </div>
);

export default ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={<div className={styles.title}>{INTL(msg.send_msg)}</div>}
    description={INTL(msg.replace_pwd)}
    actions={actions}
    style={{ marginTop: 56 }}
  />
);
