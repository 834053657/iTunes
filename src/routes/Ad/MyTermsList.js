import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal, Row, Col, Divider, Badge } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getMessageContent } from '../../utils/utils';
import TermsModal from './TermsModal';
import styles from './List.less';

const statusMap = ['default', 'warning', 'success', 'error'];

@connect(({ ad, loading }) => ({
  data: ad.termsData,
  loading: loading.models.ad,
}))
export default class TermsList extends Component {
  constructor(props) {
    super();

    this.state = {
      termsModalVisible: false,
      action: null,
      selectedRows: [],
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchTermsList',
    });
  }

  addTerm = () => {
    this.setState({
      termsModalVisible: true,
      action: "_NEW",
    });
  };

  viewTerm = r => {
    this.setState({
      termsModalVisible: true,
      action: "_OPEN",
    });
  };

  editTerm = r => {
    this.setState({
      termsModalVisible: true,
      action: "_EDIT",
    });
  };

  deleteTerm = r => {
    // todo
  };

  hideTermsModal = () => {
    this.setState({
      termsModalVisible: false,
    });
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '30%',
    },
    {
      title: '交易条款',
      dataIndex: 'content',
      width: '35%',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: '15%',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={val ? CONFIG.trans_term_status[val] : '-'} />;
      },
    },
    {
      title: '操作',
      width: '20%',
      render: r => (
        <Fragment>
          <a onClick={() => this.viewTerm(r)}>查看</a>
          <Divider type="vertical" />
          <a onClick={() => this.editTerm(r)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleteTerm(r)}>删除</a>
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
      type: 'ad/fetchTermsList',
      payload: params,
    });
  };

  render() {
    const { data: { list, pagination }, loading } = this.props;
    const { selectedRows, termsModalVisible, action } = this.state;
    
    const breadcrumbList = [
      { title: '我的广告', href: '/ad/my' },
      { title: '交易条款管理' },
    ];

    const content = (
      <Row gutter={24}>
        <Col span={12} className={styles.title}>
          交易条款管理
        </Col>
        <Col span={12} className={styles.more}>
          <Button type="primary" onClick={this.addTerm}>
            添加一条
          </Button>
        </Col>
      </Row>
    );

    return (
      <PageHeaderLayout content={content} breadcrumbList={breadcrumbList}>
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
        {termsModalVisible && (
          <TermsModal
            {...this.props}
            action={action}
            visible={termsModalVisible}
            onCancel={this.hideTermsModal}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
