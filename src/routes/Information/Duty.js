import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import { FormattedMessage as FM ,defineMessages} from 'react-intl';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Content from './Content';
import styles from './Detail.less';

const size = 'large';
const clsString = classNames(
  styles.detail,
  'horizontal',
  {},
  {
    [styles.small]: size === 'small',
    [styles.large]: size === 'large',
  }
);

/* @connect((userDetail, loading) => {
  return {data: userDetail, loading: loading}
}) */
export default class Duty extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const { loading, data } = this.props;

    return (
      <PageHeaderLayout className={styles.title} title={<FM id="duty" defaultMessage="免责" />}>
        <Content type="4" />
      </PageHeaderLayout>
    );
  }
}
