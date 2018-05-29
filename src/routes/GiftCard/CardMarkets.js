import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Tabs, Button, Icon, Pagination, Input, message } from 'antd';
import styles from './CardMarket.less';

@connect(({ card }) => ({
  card,
}))
export default class CardMarkets extends Component {
  constructor(props) {
    super();
    this.state = {
      pagination: {
        page: 1,
        page_size: 10,
      },
      loading: false,
      typeVisible: false,
      denoVisible: false,
      denoSaleVisible: false,
      minDeno: null,
      maxDeno: null,
      type: 0,
    };

    this.filter = {};

    this.setVisible = (type, visible) => {
      this.setState({
        [type]: visible,
      });
    };

    this.changeTab = e => {
      this.filter = Object.assign(this.filter, { type: e });
      this.reSetPage();
      this.reloadList();
    };

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
      this.filter = Object.assign(this.filter, { card_type: d.type });
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
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
        type: 'card/fetchCardList',
        payload: this.filter,
      }).then(() => {
        this.setState({ loading: false });
      });
    };

    //单价排序
    this.tableChange = (pagination, filter, sorter) => {
      //升序
      if (sorter.order && sorter.order === 'ascend') {
        this.filter = Object.assign(this.filter, { unit_price: 0 });
      }
      //降序
      if (sorter.order && sorter.order === 'descend') {
        this.filter = Object.assign(this.filter, { unit_price: 1 });
      }
      this.reSetPage();
      this.reloadList();
    };

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
        this.filter = Object.assign(this.filter, { minDenomination: a });
      } else if (!a && b) {
        this.filter = Object.assign(this.filter, { maxDenomination: b });
      } else if (a && b) {
        this.filter = Object.assign(this.filter, {
          minDenomination: a,
          maxDenomination: b,
        });
      } else {
        return message.error('请至少输入一个范围');
      }
      if (this.state.type === 0) {
        this.setState({ denoVisible: false });
      } else {
        this.setState({ denoSaleVisible: false });
      }
      this.reSetPage();
      this.reloadList();
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/fetchCardList',
      payload: this.state.pagination,
    });
  }

  componentDidMount() {
    console.log(this.props);
  }

  componentWillUnmount() {}

  render() {
    function FilterDemo() {
      return <div className={styles.filterDemo}>dasd</div>;
    }

    let pagination_prop;

    const cardList = this.props.card.cardList.items;

    //购买Table
    const columns = [
      {
        title: '用户名',
        dataIndex: 'owner_info.nickname',
      },
      {
        title: '类型',
        dataIndex: 'type',
        filterDropdown: (
          <div style={{ padding: '0 10px 0 10px' }} className={styles.filterDropdownCard}>
            {CONFIG.card_type
              ? CONFIG.card_type.map(type => {
                  return (
                    <div
                      className={styles.typeName}
                      key={type.id}
                      onClick={() => this.selectType(type)}
                    >
                      {type.name}
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
            onClick={() => this.setState({ typeVisible: !this.state.typeVisible })}
          />
        ),
        render: (text, record) => {
          return <span>{text && CONFIG.card_type[text] ? CONFIG.card_type[text].name : '-'}</span>;
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
                <Input value={this.state.minDeno} onChange={e => this.setMinDeno(e)} />
              </span>
              <span>---</span>
              <span className={styles.max}>
                <Input value={this.state.maxDeno} onChange={e => this.setMaxDeno(e)} />
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
              {record.min_denomination}-
              {record.max_denomination}
            </span>
          );
        },
      },
      {
        title: '总面额',
        dataIndex: 'total_denomination',
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
        dataIndex: 'operation',
        render: () => {
          return <Button type="primary">购买</Button>;
        },
      },
    ];

    const columnsSale = [
      {
        title: '用户名',
        dataIndex: 'owner_info.nickname',
      },
      {
        title: '类型',
        dataIndex: 'type',
        filterDropdown: (
          <div style={{ padding: '0 10px 0 10px' }} className={styles.filterDropdownCard}>
            {CONFIG.card_type
              ? CONFIG.card_type.map(type => {
                  return (
                    <div
                      className={styles.typeName}
                      key={type.id}
                      onClick={() => this.selectType(type)}
                    >
                      {type.name}
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
            onClick={() => this.setState({ typeVisible: !this.state.typeVisible })}
          />
        ),
        render: (text, record) => {
          return <span>{text && CONFIG.card_type[text] ? CONFIG.card_type[text].name : '-'}</span>;
        },
      },
      {
        title: '面额',
        dataIndex: 'denomination',
        onFilterDropdownVisibleChange: e => {
          this.setVisible('denoSaleVisible', e);
        },
        filterDropdownVisible: this.state.denoSaleVisible,
        filterDropdown: (
          <div className={styles.denoRange}>
            <div className={styles.range}>
              <span>区间:</span>
              <span className={styles.min}>
                <Input value={this.state.minDeno} onChange={e => this.setMinDeno(e)} />
              </span>
              <span>---</span>
              <span className={styles.max}>
                <Input value={this.state.maxDeno} onChange={e => this.setMaxDeno(e)} />
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
              {record.min_denomination}-
              {record.max_denomination}
            </span>
          );
        },
      },
      {
        title: '总面额',
        dataIndex: 'total_denomination',
      },
      {
        title: '单价',
        dataIndex: 'unit_price',
        sorter: (a, b) => a.unitPrice - b.unitPrice,
      },
      {
        title: '发卡期限',
        dataIndex: 'deadline',
        render: text => {
          return <span>{new Date(text).toLocaleDateString()}</span>;
        },
      },
      {
        title: '保障时间',
        dataIndex: 'guarantee_time',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: () => {
          return <Button type="primary">购买</Button>;
        },
      },
    ];

    return (
      <div>
        <Tabs
          onChange={e => {
            this.changeTab(e);
          }}
          defaultActiveKey="0"
        >
          <Tabs.TabPane tab="我要购买" key="0">
            <Table
              rowKey={row => row.id}
              dataSource={cardList}
              columns={columns}
              pagination={false}
              loading={this.state.loading}
              onChange={this.tableChange}
              filterDropdownVisible={this.state.typeVisible}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="我要出售" key="1">
            <Table
              rowKey={row => row.id}
              dataSource={cardList}
              columns={columnsSale}
              pagination={false}
              loading={this.state.loading}
              onChange={this.tableChange}
              filterDropdownVisible={this.state.typeVisible}
            />
          </Tabs.TabPane>
        </Tabs>
        <Pagination
          showQuickJumper
          defaultCurrent={2}
          total={500}
          onChange={this.changePage}
          current={this.state.pagination.page}
        />
      </div>
    );
  }
}
