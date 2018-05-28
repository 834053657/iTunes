import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Tabs, Button, Icon } from 'antd';
import styles from './CardMarket.less';

@connect(({ card }) => ({
  card,
}))
export default class CardMarkets extends Component {
  constructor(props) {
    super();

    this.selectAmCard = () => {
      console.log(3232);
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/fetchCardList',
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

    const cardList = this.props.card.cardList.items;
    const data = [
      {
        key: '1',
        name: 'John Brown',
        type: 32,
        denomination: 'New York No. 1 Lake Park',
        allDeno: '2222',
        delayTime: '4355',
        unitPrice: '1655',
      },
      {
        key: '2',
        name: 'Jim Green',
        type: 42,
        denomination: 'New York No. 1 Lake Park',
        allDeno: '2222',
        delayTime: '4355',
        unitPrice: '6455',
      },
      {
        key: '3',
        name: 'Joe Black',
        type: 32,
        denomination: 'New York No. 1 Lake Park',
        allDeno: '2222',
        delayTime: '4355',
        unitPrice: '6552',
      },
      {
        key: '4',
        name: 'Jim Red',
        type: 32,
        denomination: 'New York No. 1 Lake Park',
        allDeno: '2222',
        delayTime: '4355',
        unitPrice: '6535',
      },
    ];

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
            <span
              onClick={() => {
                this.selectAmCard();
              }}
              style={{ borderBottom: '1px solid #ccc' }}
              className={styles.typeName}
            >
              美卡
            </span>
            <span className={styles.typeName}>加卡</span>
          </div>
        ),
        filterIcon: <Icon type="down" />,
      },
      {
        title: '面额',
        dataIndex: 'denomination',
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
        dataIndex: 'delay_time',
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
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="我要购买" key="1">
            <Table dataSource={cardList} columns={columns} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="我要出售" key="2">
            <Table dataSource={cardList} columns={columns} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
