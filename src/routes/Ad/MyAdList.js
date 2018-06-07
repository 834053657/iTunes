import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal, Row, Col, Divider, Badge, Tooltip, Popconfirm } from 'antd';
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

  updateAd = (r, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/updateAd',
      payload: {ad_id: r.ad_id, status},
      callback: this.refreshGrid(),
    });
  };

  viewAd = (r, action) => {
    // todo
    if (r.order_type === 'card') {
      this.props.dispatch(routerRedux.push(`/ad/card/detail?ad_id=${r.ad_id}&type=${r.trade_type}&action=${action}`));
    }
    else {
      this.props.dispatch(routerRedux.push(`/ad/itunes/detail?ad_id=${r.ad_id}&type=${r.trade_type}&action=${action}`));
    }
  }

  deleteAd = r => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/deleteAd',
      payload: {ad_id: r.ad_id},
      callback: this.refreshGrid(),
    });
  };

  refreshGrid = (v) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchMyAdList',
    });
  };

  columns = [
    {
      title: '广告标号',
      dataIndex: 'ad_id',
      width: '15%',
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
      render(val, row) {
        if (val === 4) {
          return (
            <span>
              <Badge status={statusMap[3]} text={val ? `${CONFIG.ad_status[4]}` : '-'} />
              <Tooltip title={row.reason}>
                <span className={styles.reason}>原因</span>
              </Tooltip>
            </span>
          );
        } else {
          return <Badge status={statusMap[val - 1]} text={val ? CONFIG.ad_status[val] : '-'} />;
        }
      },
    },
    {
      title: '操作',
      width: '25%',
      render: r => (
        <Fragment>
          <a onClick={() => this.viewAd(r, '_OPEN')} >查看</a>
          {r.status === 1 && (
            <span>
              <Divider type="vertical" />
              <a onClick={() => this.updateAd(r, 2)} >恢复</a>
            </span>
          )}
          {r.status === 2 && (
            <span>
              <Divider type="vertical" />
              <a onClick={() => this.updateAd(r, 1)} >暂停</a>
            </span>
          )}
          {r.status === 1 && (
            <span>
              <Divider type="vertical" />
              <a onClick={() => this.viewAd(r, '_EDIT')} >编辑</a>
            </span>
          )}
          {r.status === 4 && (
            <span>
              <Divider type="vertical" />
              <Popconfirm title="您确认要删除此广告?" onConfirm={() => this.deleteAd(r)} okText="确认" cancelText="取消">
                <a>删除</a>
              </Popconfirm>
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

    const content = (
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
    );

    return (
      <PageHeaderLayout content={content}>
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
      </PageHeaderLayout>
    );
  }
}
