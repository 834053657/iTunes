import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getMessageContent } from '../../utils/utils';
import styles from './Message.less';

@connect(({ message, loading }) => ({
  data: message.msgData,
  loading: loading.models.message,
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
      type: 'message/fetchMessageList',
    });
  }

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '70%',
      render: (val, row) => {
        if (row.msg_type === -1)
          return (
            <Link to={`/message/info-detail/${row.id}`}>
              <Icon type="file-text" /> {val}
            </Link>
          );
        else
          return (
            <a onClick={() => this.readMsg(row)}>
              {row.msg_type === 1 ? <Icon type="file-text" /> : <Icon type="bell" />}{' '}
              {row.msg_type === 1 ? val : getMessageContent(row)}
            </a>
          );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'created_at',
      width: '30%',
      render: val => (
        <span>{val ? moment(new Date(val * 1000)).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
      ),
    },
  ];

  readMsg = row => {
    const { dispatch } = this.props;

    if (row.status === 0) {
      dispatch({
        type: 'message/readMessage',
        payload: { all: false, id: row.id },
        callback: () => {
          this.showMsg(row);
        },
      });
    } else {
      this.showMsg(row);
    }
  };

  showMsg = row => {
    const { dispatch } = this.props;

    if (row.msg_type === 1) {
      // this.props.dispatch(routerRedux.push(`/message/info-detail/${row.id}`));
      window.location.href = `/#/message/info-detail/${row.id}`;
    } else if ([11, 12, 21, 22, 31, 32, 33, 34, 41, 42].indexOf(row.msg_type) >= 0) {
      Modal.success({
        // title: row.title,
        title: '提示',
        content: getMessageContent(row),
        onOk: () => {
          dispatch({
            type: 'message/fetchMessageList',
          });
        },
      });
    } else if ([101, 102, 103, 104, 105, 106, 107].indexOf(row.msg_type) >= 0) {
      //todo redirect to order detail
      if (row.content && row.content.goods_type === 1)
        this.props.dispatch(routerRedux.push(`/itunes/order/${row.content.order_id}`));
      else if (row.content && row.content.goods_type === 2) {
        this.props.dispatch(routerRedux.push(`/card/order/${row.content.order_id}`));
      }
    } else {
      // todo
      console.log(row.msg_type);
    }
  };

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
      type: 'message/fetchMessageList',
      payload: params,
    });
  };

  render() {
    const { data: { list, pagination }, loading } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderLayout title="消息中心">
        <div>
          <Card bordered={false} className={styles.message_list}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={this.columns}
              pagination={pagination}
              onChange={this.handleTableChange}
              showHeader={false}
              rowClassName={(r, index) => {
                return r.status === 1 ? styles.read : '';
              }}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
