import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal } from 'antd';
import styles from './TransferList.less';

export default class TransferList extends Component {
  constructor(props) {
    super();

    this.state = {};
  }

  columns = [
    {
      title: '交易时间',
      dataIndex: 'trade_at',
      render: (v, row) => {
        return <span>{v}</span>;
      },
    },
    {
      title: '产品类型',
      dataIndex: 'order_type',
    },
    {
      title: '方式',
      dataIndex: 'trade_type',
    },
    {
      title: '类型',
      dataIndex: 'pay_type',
    },
    {
      title: '金额',
      dataIndex: 'money',
    },
    {
      title: '手续费',
      dataIndex: 'fee',
    },
    {
      title: '操作',
      dataIndex: 'opt_',
    },
  ];

  handleTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
    };

    this.props.onChange(params);
  };

  render() {
    const { data, loading } = this.props;
    const { list = [], pagination = {} } = data || {};
    console.log(list);

    return (
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
    );
  }
}
