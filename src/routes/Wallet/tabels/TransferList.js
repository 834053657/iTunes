import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { FormattedMessage as FM } from 'react-intl';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal, Badge, Tooltip } from 'antd';
import numeral from 'numeral';

import DescriptionList from 'components/DescriptionList';
import styles from './TransferList.less';

const { Description } = DescriptionList;

const statusMap = ['default', 'processing', 'error', 'success'];

export default class TransferList extends Component {
  constructor(props) {
    super();
    this.state = {
      modalInfo: null,
    };
  }

  componentDidMount() {
    this.handleTableChange();
  }

  showModal = row => {
    this.setState({
      modalInfo: row,
    });
  };

  hideModal = () => {
    this.setState({
      modalInfo: null,
    });
  };

  columns = [
    {
      title: <FM id="transferList.created_at" defaultMessage="交易时间" />,
      dataIndex: 'created_at',
      render: (v, row) => {
        return <span>{v ? moment(v * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>;
      },
    },
    {
      title: <FM id="transferList.goods_type" defaultMessage="产品类型" />,
      dataIndex: 'goods_type',
      render: (v, row) => {
        return <span>{v ? CONFIG.goods_type[v] : '无'}</span>;
      },
    },
    {
      title: <FM id="transferList.paid_type" defaultMessage="支付方式" />,
      dataIndex: 'paid_type',
      render: (v, row) => {
        return <span>{v ? CONFIG.payments[v] : '无'}</span>;
      },
    },
    {
      title: <FM id="transferList.trade_type" defaultMessage="交易类型" />,
      dataIndex: 'trade_type',
      render: (v, row) => {
        return <span>{v ? CONFIG.tradeType[v] : '无'}</span>;
      },
    },
    {
      title: <FM id="transferList.amount" defaultMessage="金额" />,
      dataIndex: 'amount',
      render: (v, row) => {
        return (
          <span className={row.type === 1 ? 'text-green' : 'text-red'}>
            <b>{row.type === 1 ? '+' : '-'}</b> {numeral(v).format('0,0.00')}
          </span>
        );
      },
    },
    {
      title: <FM id="transferList.fee" defaultMessage="手续费" />,
      dataIndex: 'fee',
      render: (v, row) => {
        return <span>{`￥${numeral(v).format('0,0.00')}`}</span>;
      },
    },
    {
      title: <FM id="transferList.status" defaultMessage="状态" />,
      dataIndex: 'status',
      render: (val, row) => {
        if (val === 3) {
          return (
            <span>
              <Badge status={statusMap[2]} text={CONFIG.transaction_status[val]} />
              <Tooltip title={row.reason}>
                <a>
                  {' '}
                  <FM id="transferList.status_reason" defaultMessage="原因" />{' '}
                </a>
              </Tooltip>
            </span>
          );
        } else {
          return (
            <Badge status={statusMap[val - 1]} text={val ? CONFIG.transaction_status[val] : '-'} />
          );
        }
      },
    },
    {
      title: <FM id="transferList.operator" defaultMessage="操作" />,
      dataIndex: 'opt_',
      render: (v, row) => {
        return (
          <Fragment>
            <a onClick={this.showModal.bind(this, row)}>
              <FM id="transferList.operator_detail" defaultMessage="详情" />
            </a>
          </Fragment>
        );
      },
    },
  ];

  handleTableChange = (pagination = {}, filtersArg, sorter) => {
    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
    };

    this.props.dispatch({
      type: 'wallet/fetchTransfer',
      payload: params,
    });
  };

  getMethodContent = item => {
    const { paid_type, payment = {} } = item || {};
    let content = '';

    switch (paid_type) {
      case 'wechat':
      case 'alipay':
        content = (
          <div>
            {CONFIG.payments[paid_type] || (
              <FM id="transferList.payment_unUse_phone" defaultMessage="无效的支付方式" />
            )}{' '}
            - {payment.account}
          </div>
        );
        break;
      case 'bank':
        content = (
          <div>
            {CONFIG.payments[paid_type] || (
              <FM id="transferList.payment_unUse_bank" defaultMessage="无效的支付方式" />
            )}{' '}
            - {payment.bank_account}
          </div>
        );
        break;
    }
    return content;
  };

  renderDetail = modalInfo => {
    const { created_at, amount, fee, goods_type, trade_type, payment, type } = modalInfo || {};
    return (
      <DescriptionList col={1} className={styles.detailBox}>
        <Description term={<FM id="transferList.product_type" defaultMessage="产品类型" />}>
          {goods_type ? (
            CONFIG.goods_type[goods_type]
          ) : (
            <FM id="transferList.product_type_none" defaultMessage="无" />
          )}
        </Description>
        <Description term={<FM id="transferList.deal_type" defaultMessage="交易类型" />}>
          {trade_type ? (
            CONFIG.tradeType[trade_type]
          ) : (
            <FM id="transferList.deal_type_none" defaultMessage="无" />
          )}
        </Description>
        <Description term={<FM id="transferList.account_user" defaultMessage="账号" />}>
          {this.getMethodContent(modalInfo)}
        </Description>
        <Description term={<FM id="transferList.amount_wallet" defaultMessage="金额" />}>
          <span>{`¥ ${type === 1 ? '+' : '-'}${numeral(amount).format('0,0.00')}`}</span>
        </Description>
        <Description term={<FM id="transferList.charge" defaultMessage="手续费" />}>
          <span>{`¥ ${numeral(fee).format('0,0.00')}`}</span>
        </Description>
        <Description term={<FM id="transferList.deal_detail_time" defaultMessage="交易时间" />}>
          {created_at ? moment(created_at * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Description>
      </DescriptionList>
    );
  };

  render() {
    const { modalInfo } = this.state;
    const { transfer = {}, transferLoading } = this.props;
    const { list = [], pagination = {} } = transfer || {};

    return (
      <Card bordered={false} className={styles.message_list}>
        <Table
          loading={transferLoading}
          rowKey={record => record.id}
          dataSource={list}
          columns={this.columns}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
        <Modal
          title={<FM id="transferList.deal_modal_detail" defaultMessage="交易详情" />}
          visible={!!modalInfo}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          {this.renderDetail(modalInfo)}
        </Modal>
      </Card>
    );
  }
}
