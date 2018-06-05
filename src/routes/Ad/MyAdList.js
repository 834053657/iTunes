import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal, Row, Col, Divider, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getMessageContent } from '../../utils/utils';
import styles from './List.less';

const statusMap = ['warning', 'processing', 'error', 'default'];

@connect(({ ad, loading }) => ({
  data: ad.myAdData,
  loading: loading.models.ad,
}))
export default class List extends Component {
  constructor(props) {
    super();

    this.state = {
      selectedRows: [],
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchMyAdList',
    });
  }

  processAd = (r) => {
    // todo
  }

  columns = [
    {
      title: '广告标号',
      dataIndex: 'ad_id',
      width: '15%',
      render: (val, row) => {
        return <Link to={`/message/info-detail/${row.id}`}>{val}</Link>;
      },
    },
    {
      title: '产品类型',
      dataIndex: 'order_type',
      width: '15%',
      render: (val, row) => CONFIG.googs_type[val],
    },
    {
      title: '交易类型',
      dataIndex: 'trade_type',
      width: '15%',
      render: (val, row) => CONFIG.ad_type[val],
    },
    {
      title: '单价',
      dataIndex: 'price',
      width: '15%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: '15%',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={val ? CONFIG.ad_status[val] : '-'} />;
      },
    },
    {
      title: '操作',
      width: '25%',
      render: r => (
        <Fragment>
          <a href={`/#/msg-detail/${r.id}`}>查看</a>
          {r.status === 1 && (
            <span>
              <Divider type="vertical" />
              <a onClick={() => this.processAd(r)}>恢复</a>
            </span>
          )}
          {r.status === 2 && (
            <span>
              <Divider type="vertical" />
              <a onClick={() => this.processAd(r)}>暂停</a>
            </span>
          )}
          {r.status === 1 && (
            <span>
              <Divider type="vertical" />
              <a href={`/#/msg-detail/${r.id}`}>编辑</a>
            </span>
          )}
          {r.status === 4 && (
            <span>
              <Divider type="vertical" />
              <a onClick={() => this.processAd(r)}>删除</a>
            </span>
          )}
        </Fragment>
      ),
    },
  ];

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, getValue } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
      // ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'ad/fetchMyAdList',
      payload: params,
    });
  };

  render() {
    const { data: { list, pagination }, loading } = this.props;
    const { selectedRows } = this.state;
    console.log(111, this.props);

    return (
      <Fragment>
        <Row gutter={24}>
          <Col span={12} className={styles.title}>
            我的广告
          </Col>
          <Col span={12} className={styles.more}>
            <a className={styles.itunes_btn} href="/#/ad/terms">
              交易条款管理
            </a>
          </Col>
        </Row>
        <div>
          <Card bordered={false} className={styles.message_list}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={this.columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </Card>
        </div>
      </Fragment>
    );
  }
}
