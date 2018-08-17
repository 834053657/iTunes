import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from 'components/Result';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import { getQueryString } from '../../utils/utils';

import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/">
      <Button size="large"><FM id='RegisterResult.goback' /></Button>
    </Link>
  </div>
);

export default ({ location }) => {
  const { account = '' } = getQueryString(location.search);
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={<div className={styles.title}><FM id='RegisterResult.signSuccess' values={{userAccount:account}} /></div>}
      // description="激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。"
      actions={actions}
      style={{ marginTop: 56 }}
    />
  );
};
