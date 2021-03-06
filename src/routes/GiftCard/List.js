import React, {Component, Fragment} from 'react';
import {parse} from 'url';
import numeral from 'numeral';
import {connect} from 'dva';
import {stringify} from 'qs';
import {map, omitBy, filter, isEmpty} from 'lodash';
import {FormattedMessage as FM,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  Popover,
  Form,
  Avatar,
  Badge,
  Popconfirm,
} from 'antd';
import {routerRedux} from 'dva/router';
import FilterDemoinForm from './forms/FilterDemoinForm';
import {getQueryString} from '../../utils/utils';
import styles from './List.less';

const InputGroup = Input.Group;
const FormItem = Form.Item;
const msg = defineMessages({
  minute: {
    id: 'listHell.minute',
    defaultMessage: '分钟',
  },
});
@injectIntl()
@connect(({card, loading, user}) => ({
  list: card.list,
  user: user.currentUser.user,
  loading: loading.effects['card/fetchCardList_'],
}))
export default class List extends Component {
  constructor(props) {
    super(props);
    const {type = '2'} = getQueryString(props.location.search);
    this.state = {
      loading: false,
      type,
      denoVisible: false,
      denominFilterValue: undefined,
      card_type: [],
      password_type: [],
      filter: {},
      order_by: false,
    };
  }

  changeTab = type => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    const params = {
      type,
      page: 1,
      denoVisible: false,
      denominFilterValue: undefined,
      card_type: [],
      password_type: [],
      filter: {},
      order_by: false,
    };
    this.setState(
      {
        loading: true,
        ...params,
      },
      () => {
        this.fetchData(params, () => {
          this.props.dispatch(routerRedux.replace({search: stringify({type})}));
          this.setState({
            loading: false,
          });
        });
      }
    );
  };

  denoType = r => {
    return r.condition instanceof Array;
  };

  denoList = r => {
    const a = [];
    if (this.denoType(r)) {
      r.condition.map(i => {
        return a.push(i.money);
      });
      return a;
    }
  };

  denoBuyList = r => {
    const a = [];
    if (r.money instanceof Array) {
      return r.money;
    } else {
      return false;
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchData = (params_ = {}, callback) => {
    let params = {};
    const {type, card_type, order_by, password_type, denominFilterValue, filters} = this.state;
    params.page = params_.page || {};
    params.type = params_.type || type;
    params.card_type = params_.card_type || card_type;
    params.order_by = params_.order_by || order_by;
    params.password_type = params_.password_type || password_type;
    const {min, max} = params_.denominFilterValue || denominFilterValue || {};
    params.min_money = min;
    params.max_money = max;

    if (params.password_type) {
      params.password_type = params.password_type.toString();
    }

    if (params_.card_type) {
      params.card_type = params.card_type.toString();
    }

    if (params.order_by) {
      params.order_by = params.order_by === 'descend' ? 1 : 2;
    }

    params = omitBy(params, item => !item);
    this.props
      .dispatch({
        type: 'card/fetchCardList_',
        payload: {
          ...params,
        },
      })
      .then(() => {
        if (!this.interval) {
          this.interval = setInterval(this.fetchData, 30 * 1000);
        }
        callback && callback();
      });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const params1 = {
      page: pagination.current,
      page_size: pagination.pageSize,
      card_type: filters.type,
      password_type: filters.password_type,
    };
    if (sorter.field) {
      params1.order_by = sorter.order; // === 'descend' ? 1 : 2; //`${sorter.field}_${sorter.order}`;
    }

    if (this.interval) {
      clearInterval(this.interval);
    }
    this.setState(
      {
        ...params1,
      },
      () => {
        this.fetchData(params1);
      }
    );
  };

  handleResetFilterDemoin = () => {
    this.setState({
      denominFilterValue: undefined,
      denoVisible: false,
    });
    this.state.denominFilterValue = undefined;
    this.state.denoVisible = false;
    this.fetchData();
  };

  handleFilterDemoin = value => {
    this.setState({
      denominFilterValue: value,
      denoVisible: false,
    });
    this.fetchData({
      denominFilterValue: value,
    });
  };

  initColumns = () => {
    const {user = {}} = this.props;
    const {type, denominFilterValue} = this.state;
    const cardTypes = map(CONFIG.card_type.filter(t => t.valid), item => {
      return {text: item.name, value: item.type};
    });
    const cardPwdType = map(CONFIG.cardPwdType, (text, value) => {
      return {text, value};
    });
    let columns = [
      {
        title: <FM id="nickname_" defaultMessage="用户名" />,
        width: '130px',
        dataIndex: 'nickname_',
        render: (text, record) => {
          const userinfo = record.owner;
          return (
            <div className={styles.userInfo}>
              <Badge
                status={userinfo.online || userinfo.id === user.id ? 'success' : 'default'}
                offset={[35, -5]}
                dot
              >
                <Avatar size="large" src={userinfo.avatar} />
              </Badge>
              <span className={styles.name}>{userinfo.nickname}</span>
            </div>
          );
        },
      },
      {
        title: <FM id="type" defaultMessage="类型" />,
        dataIndex: 'type',
        width: '80px ',
        filterMultiple: false,
        filteredValue: this.state.card_type,
        filters: cardTypes,
        render: (text, record) => {
          return (
            <span>
              {CONFIG.cardTypeMap[record.card_type]
                ? CONFIG.cardTypeMap[record.card_type].name
                : '-'}
            </span>
          );
        },
      },
      {
        title:
          type === '2' ? (
            <FM id="contain" defaultMessage="包含" />
          ) : (
            <FM id="require" defaultMessage="要求" />
          ),
        dataIndex: 'password_type',
        width: '90px ',
        filters: cardPwdType,
        filterMultiple: false,
        filteredValue: this.state.password_type,
        render: (v, row) => {
          return <span>{v ? CONFIG.cardPwdType[v] : '-'}</span>;
        },
      },
      {
        title: <FM id="list.denomination" defaultMessage="面额" />,
        dataIndex: 'denomination',
        width: '100px ',
        onFilterDropdownVisibleChange: e => {
          this.setState({
            denoVisible: e,
          });
        },
        filterIcon: (
          <Icon
            type="filter"
            style={{color: this.state.denominFilterValue ? '#108ee9' : '#aaa'}}
          />
        ),
        filterDropdownVisible: this.state.denoVisible,
        filterDropdown: (
          <div>
            {this.state.denoVisible ? (
              <FilterDemoinForm
                initialValues={this.state.denominFilterValue}
                onSubmit={this.handleFilterDemoin}
                onCancel={this.handleResetFilterDemoin}
              />
            ) : null}
          </div>
        ),
        render: (text, record) => {
          if (type === '2') {
            return (
              <span>
                {this.denoBuyList(record)
                  ? this.denoBuyList(record).map((m, index) => {
                    return (
                      <span key={index}>{m}{index < this.denoBuyList(record).length - 1 ? '/' : null}</span>
                    );
                  })
                  : null}
              </span>
            );
          } else {
            return (
              <span>
                {this.denoType(record) ? (
                  this.denoList(record) ? (
                    this.denoList(record).map((i, index) => {
                      return (
                        <span key={index}>
                          {i}
                          {index < this.denoList(record).length - 1 ? '/' : null}
                        </span>
                      );
                    })
                  ) : null
                ) : (
                  <span>
                    {record.condition.min_money}
                    {' - '}
                    {record.condition.max_money}
                  </span>
                )}
              </span>
            );
          }
        },
      },
      {
        title: <FM id="total_denomination" defaultMessage="总面额" />,
        width: '100px ',
        dataIndex: 'total_denomination',
        render: (text, record) => <span>{numeral(record.total_money).format('0,0.00')}</span>,
      },
      {
        title: <FM id="deadline" defaultMessage="发卡期限" />,
        width: '80px',
        dataIndex: 'deadline',
        render: v => <span>{v} {this.props.intl.formatMessage(msg.minute)}</span>,
      },
      {
        title: <FM id="unit_price" defaultMessage="单价" />,
        width: '80px',
        dataIndex: 'unit_price',
        render: v => <span>{numeral(v).format('0,0.00')} RMB</span>,
        // sorter: true,
        // sortOrder: this.state.order_by,
      },
      {
        title: <FM id="guarantee_time" defaultMessage="保障时间" />,
        width: '100px',
        dataIndex: 'guarantee_time',
        render: v => <span>{v} {this.props.intl.formatMessage(msg.minute)}</span>,
      },
      {
        title: <FM id="operation_" defaultMessage="操作" />,
        width: '80px',
        dataIndex: 'operation_',
        render: (text, record = {}) => {
          const {owner = {}} = record || {};
          return type === '2' ? (
            <Button
              type="primary"
              disabled={owner.id === user.id}
              onClick={() => {
                this.props.history.push({
                  pathname: `/card/deal-detail/${record.id}`,
                });
              }}
            >
              {<FM id="toBuy_" defaultMessage="购买" />}
            </Button>
          ) : (
            <Popconfirm
              title={
                <p>
                  {
                    <FM
                      id="toBuy_confirm"
                      defaultMessage="广告主要求在{deadline}分钟内发卡您确认出售"
                      values={{deadline: record.deadline}}
                    />
                  }
                  {/*广告主要求在{record.deadline}分钟内发卡，<br />您确认出售？*/}
                </p>
              }
              onConfirm={() => {
                this.props.history.push({
                  pathname: `/card/deal-detail/${record.id}`,
                });
              }}
            >
              <Button type="primary" disabled={owner.id === user.id}>
                {<FM id="toSell_" defaultMessage="出售" />}
              </Button>
            </Popconfirm>
          );
        },
      },
    ];

    if (type === '2') {
      columns = filter(columns, item => item.dataIndex !== 'deadline');
    } else {
      columns = filter(columns, item => item.dataIndex !== 'total_denomination');
    }

    return columns;
  };

  render() {
    const {list, loading} = this.props;
    const {type, denominFilterValue} = this.state;
    const {items, pagination} = list || {};
    return (
      <div className={styles.page}>
        <h2>{<FM id="tradingHell" defaultMessage="礼品卡大厅" />}</h2>
        <Tabs onChange={this.changeTab} activeKey={type}>
          {/*出售广告*/}
          <Tabs.TabPane tab={<FM id="toBuy" defaultMessage="我要购买" />} key="2" />
          {/*购买广告*/}
          <Tabs.TabPane tab={<FM id="toSell" defaultMessage="我要出售" />} key="1" />
        </Tabs>
        <Table
          locale={{emptyText: ''}}
          rowKey={row => row.id}
          dataSource={items}
          columns={this.initColumns()}
          onChange={this.handleTableChange}
          pagination={{
            ...pagination,
          }}
          scroll={{x: 1200}}
          loading={loading}
        />
      </div>
    );
  }
}
