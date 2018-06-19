import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { map, delay } from 'lodash';
import { Link, routerRedux } from 'dva/router';
import numeral from 'numeral';
import moment from 'moment';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Card,
  Modal,
  Row,
  Col,
  Divider,
  Badge,
  Tooltip,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getMessageContent } from '../../utils/utils';
import styles from './MyOrderList.less';

const TabPane = Tabs.TabPane;
const statusMap = ['warning', 'processing', 'error', 'default'];

@connect(({ user, loading }) => ({
  data: user.myOrders,
  loading: loading.effects['user/fetchMyOrderList'],
}))
export default class List extends Component {
  constructor(props) {
    super();
    this.state = {
      type: '1',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { type } = this.state;
    this.fetch({ type });
  }

  columns = [
    {
      title: '交易单号',
      dataIndex: 'order_no',
      render: (v, row) => <Link to={`/card/deal-line/${row.id}`}>{v}</Link>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: val => (
        <span>{val ? moment(new Date(val * 1000)).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
      ),
    },
    {
      title: '交易产品',
      dataIndex: 'order_type',
      render: (val, row) => (val && CONFIG.goods_type[val] ? CONFIG.goods_type[val] : '-'),
    },
    {
      title: '交易对象',
      dataIndex: 'trader',
      render: (_, row) => (
        <span className="text-blue">{row.trader ? row.trader.nickname : '-'}</span>
      ),
    },
    {
      title: '交易类型',
      dataIndex: 'status',
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
      title: '金额',
      dataIndex: 'amount',
      render: (v, row) => {
        return <span dangerouslySetInnerHTML={{ __html: `¥ ${numeral(v).format('0,0')}` }} />;
      },
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      render: (v, row) => {
        return <span dangerouslySetInnerHTML={{ __html: `¥ ${numeral(v).format('0,0')}` }} />;
      },
    },
    {
      title: '操作',
      dataIndex: '_opt_',
      render: (_, row) => <Link to={`/card/deal-line/${row.id}`}>查看</Link>,
    },
  ];

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { type } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      type,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetch(params);
  };

  fetch = params => {
    this.props.dispatch({
      type: 'user/fetchMyOrderList',
      payload: {
        type: this.state.type,
        pagination: this.props.pagination,
        ...params,
      },
    });
  };

  handleChangeType = type => {
    this.fetch({ type });
    this.setState({
      type,
    });
  };

  render() {
    const { type } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    return (
      <PageHeaderLayout title="我的订单">
        <div>
          <Card bordered={false} className={styles.message_list}>
            <Tabs activeKey={type} onChange={this.handleChangeType}>
              {map(CONFIG.order_status, (text, value) => <TabPane tab={text} key={value} />)}
            </Tabs>
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
