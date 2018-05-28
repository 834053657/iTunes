import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Button, Card, Row, Col, Modal, Form, Input, Table } from 'antd';
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

@connect(({ message, loading }) => ({
  data: message.infoData,
  loading: loading.models.message,
}))
/* @connect((userDetail, loading) => {
  return {data: userDetail, loading: loading}
}) */
@Form.create()
export default class InfoDetail extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    /*dispatch({
      type: 'userDetail/fetch',
      payload: { id: this.props.match.params.id },
    });*/
  }

  render() {
    const { loading } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const breadcrumbList = [
      { title: '首页', href: '/' },
      { title: '更多资讯', href: '/message/info-list' },
      { title: '资讯详情' },
    ];

    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumbList}>
        <div className={clsString}>
          <Card bordered={false}>
            <a
              className={styles.itunes_btn}
              onClick={() => this.props.dispatch(routerRedux.goBack())}
            >
              返回
            </a>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
