import React, {Component} from 'react';
import { parse } from 'url';
import {connect} from 'dva';
import {Table, Tabs, Button, Icon, Pagination, Input, message} from 'antd';
import {filter} from 'lodash';
import {routerRedux} from 'dva/router';
import styles from './CardMarkets.less';

@connect(({card, loading}) => ({
  list: card.list,
  loading: loading.effects['card/fetchCardList_'],
}))
export default class CardMarkets extends Component {
  constructor(props) {
    super(props);
    let { type='2' } = parse(props.location.search, true).query || {}
    this.state = {
      type,
      typeVisible: false,
      denoVisible: false,
      minDeno: null,
      maxDeno: null ,
      type_page: 2,
    };

    // this.setVisible = (type, visible) => {
    //   this.setState({
    //     [type]: visible,
    //   });
    // };

    this.reSetPage = () => {
      this.state.pagination.page = 1;
      this.setState({
        pagination: {
          page: 1,
          page_size: 10,
        },
      });
      this.filter = Object.assign(this.filter, this.state.pagination);
    };

    //select Card Type
    this.selectType = d => {
      // console.log('card type');
      this.filter = Object.assign(this.filter, {card_type: d.type});
      this.reSetPage();
      this.reloadList();
      this.setState({
        typeVisible: false,
      });
    };

    this.changePage = e => {
      this.state.pagination.page = e;
      this.setState({
        pagination: {
          page: e,
          page_size: 10,
        },
      });
      this.filter = Object.assign(this.filter, this.state.pagination);
      this.reloadList();
    };

    //after set filter，reload data
    this.reloadList = () => {
      const {type_page} = this.state;
      // this.setState({ loading: true });
      const {dispatch} = this.props;
      if (+type_page === 2) {
        //购买
        dispatch({
          type: 'card/fetchCardList',
          payload: this.filter,
        }).then(() => {
          // this.setState({ loading: false });
        });
      } else if (+type_page === 1) {
        //出售
        dispatch({
          type: 'card/fetchCardList',
          payload: this.filter,
        }).then(() => {
          // this.setState({ loading: false });
        });
      }
    };

    // //单价排序
    // this.tableChange = (pagination, filter, sorter) => {
    //   //升序
    //   if (sorter.order && sorter.order === 'ascend') {
    //     this.filter = Object.assign(this.filter, { unit_price: 0 });
    //     this.reSetPage();
    //     this.reloadList();
    //   }
    //   //降序
    //   if (sorter.order && sorter.order === 'descend') {
    //     this.filter = Object.assign(this.filter, { unit_price: 1 });
    //     this.reSetPage();
    //     this.reloadList();
    //   }
    // };

    this.setMinDeno = e => {
      this.setState({
        minDeno: e.target.value,
      });
    };

    this.setMaxDeno = e => {
      this.setState({
        maxDeno: e.target.value,
      });
    };

    this.resetRangeFilter = () => {
      this.setState({
        minDeno: null,
        maxDeno: null,
      });
    };

    this.setRangeFilter = () => {
      const a = parseInt(this.state.minDeno);
      const b = parseInt(this.state.maxDeno);
      if (isNaN(this.state.minDeno) || isNaN(this.state.maxDeno)) {
        return message.error('输入格式错误');
      }
      if (a >= b) {
        return message.error('请输入正确范围');
      }
      if (a && !b) {
        this.filter = Object.assign(this.filter, {minDenomination: a});
      } else if (!a && b) {
        this.filter = Object.assign(this.filter, {maxDenomination: b});
      } else if (a && b) {
        this.filter = Object.assign(this.filter, {
          minDenomination: a,
          maxDenomination: b,
        });
      } else {
        return message.error('请至少输入一个范围');
      }
      if (this.state.type_page === 0) {
        this.setState({denoVisible: false});
      }
      this.reSetPage();
      this.reloadList();
    };
  }

  changeTab = type => {
    this.fetchData({type}, () => {
      //this.props.dispatch(routerRedux.replace({pathname: '/card/market', query: {type:1}}))
      //this.props.history.replace(`/card/market?type=${type}`)
      //routerRedux.push({pathname:`/card/market?type=${type}`})
      this.props.dispatch(
        routerRedux.replace({search: `?type=${type}`})
      )
      this.setState({
        type,
      });
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (params_, callback) => {
    const params = {...params_};
    const {type} = this.state;

    params.type = params.type || type;
    this.props
      .dispatch({
        type: 'card/fetchCardList_',
        payload: params,
      })
      .then(() => {
        callback && callback();
      });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    // const { dispatch, getValue } = this.props;
    // const { formValues } = this.state;
    //
    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    // const params = {
    //   page: pagination.current,
    //   page_size: pagination.pageSize,
    //   ...formValues,
    //   // ...filters,
    // };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }
    // console.log(this.filter);

    this.fetchData();
  };

  initColumns = () => {
    const {type} = this.state;
    let columns = [
      {
        title: '用户名',
        dataIndex: 'owner.nickname',
      },
      {
        title: '类型',
        dataIndex: 'type',
        filterDropdown: (
          <div style={{padding: '0 10px 0 10px'}} className={styles.filterDropdownCard}>
            {CONFIG.card_type
              ? CONFIG.card_type.map(item => {
                return (
                  <div
                    className={styles.typeName}
                    key={item.type}
                    onClick={() => this.selectType(item)}
                  >
                    {item.name}
                  </div>
                );
              })
              : null}
          </div>
        ),
        filterDropdownVisible: this.state.typeVisible,
        onFilterDropdownVisibleChange: e => {
          this.setVisible('typeVisible', e);
        },
        filterIcon: (
          <Icon
            type="down"
            onClick={() => this.setState({typeVisible: !this.state.typeVisible})}
          />
        ),
        render: (text, record) => {
          return (
            <span>
              {CONFIG.card_type[record.card_type - 1]
                ? CONFIG.card_type[record.card_type - 1].name
                : '-'}
            </span>
          );
        },
      },
      {
        title: type === '2' ? '包含' : '要求',
        dataIndex: 'password_type',
        render: (v, row) => {
          return <span>{v ? CONFIG.cardPwdType[v] : '-'}</span>;
        },
      },
      {
        title: '面额',
        dataIndex: 'denomination',
        onFilterDropdownVisibleChange: e => {
          this.setVisible('denoVisible', e);
        },
        filterDropdownVisible: this.state.denoVisible,
        filterDropdown: (
          <div className={styles.denoRange}>
            <div className={styles.range}>
              <span>区间:</span>
              <span className={styles.min}>
                <Input value={this.state.minDeno} onChange={e => this.setMinDeno(e)}/>
              </span>
              <span>---</span>
              <span className={styles.max}>
                <Input value={this.state.maxDeno} onChange={e => this.setMaxDeno(e)}/>
              </span>
            </div>
            <div className={styles.rangeBtns}>
              <Button
                onClick={() => {
                  this.resetRangeFilter();
                }}
              >
                重置
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  this.setRangeFilter();
                }}
              >
                确定
              </Button>
            </div>
          </div>
        ),
        render: (text, record) => {
          return (
            <span>
              {this.denoBuyList(record)
                ? this.denoBuyList(record).map((m, index) => {
                  return (
                    <span key={index}>
                      {m}
                      {index < this.denoBuyList(record).length - 1 ? '/' : null}
                    </span>
                  );
                })
                : null}
            </span>
          );
        },
      },
      {
        title: '总面额',
        dataIndex: 'total_denomination',
        render: (text, record) => {
          return <span>{this.amountMoney(record)}</span>;
        },
      },
      {
        title: '发卡期限',
        dataIndex: 'deadline',
      },
      {
        title: '单价',
        dataIndex: 'unit_price',
        sorter: (a, b) => a.unitPrice - b.unitPrice,
      },
      {
        title: '保障时间',
        dataIndex: 'guarantee_time',
      },
      {
        title: '操作',
        dataIndex: 'operation_',
        render: (text, record) => {
          return (
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push({
                  pathname: `/card/deal-detail/${record.id}`,
                });
              }}
            >
              {type === '2' ? '购买' : '出售'}
            </Button>
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

  denoBuyList = r => {
    // console.log(r)
    const a = [];
    if (r.money instanceof Array) {
      return r.money;
    } else {
      return false;
    }
  };

  amountMoney = r => {
    let a = 0;
    if (r.cards instanceof Array) {
      r.cards.map(i => {
        return (a += i.money * i.count);
      });
      return a;
    } else {
      return false;
    }
  };

  render() {
    const {list, loading} = this.props;
    const {type} = this.state;
    const {items, pagination} = list || {};
    // console.log(pagination);
    return (
      <div>
        <Tabs onChange={this.changeTab} activeKey={type}>
          {/*出售广告*/}
          <Tabs.TabPane tab="我要购买" key="2"/>
          {/*购买广告*/}
          <Tabs.TabPane tab="我要出售" key="1"/>
        </Tabs>

        <Table
          rowKey={row => row.id}
          dataSource={items}
          columns={this.initColumns()}
          onChange={this.handleTableChange}
          pagination={{
            ...pagination,
            showQuickJumper: true,
          }}
          loading={loading}
        />
      </div>
    );
  }
}
