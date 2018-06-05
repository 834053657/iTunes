import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import Content from './Content';
import { Button, Card, Row, Col, Modal, Form, Input, Table, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Detail.less';

const FormItem = Form.Item;

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
@Form.create()
export default class Help extends PureComponent {
  state = {};

  componentDidMount() {

  }

  render() {
    const { loading, data } = this.props;

    return (
      <PageHeaderLayout className={styles.title} title="帮助">
        <Content type='help' />
      </PageHeaderLayout>
    );
  }
}
