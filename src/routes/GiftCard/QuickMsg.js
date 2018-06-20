import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Button, Icon, Steps, Avatar, Select } from 'antd';
import { map } from 'lodash';
import moment from 'moment';
import styles from './MarketBuy/StepTwo.less';

const Step = Steps.Step;
const Option = Select.Option;

@connect(({ card }) => ({
  card,
}))
export default class QuickMsg extends Component {
  constructor(props) {
    super();
    this.state = {
      term: '快捷短语',
    };
  }

  componentDidMount() {
    const { dispatch, detail: { order = {} } } = this.props;
    dispatch({
      type: 'card/fetchQuickMsgList',
      payload: {
        order_id: order.id,
        order_msg_type: 1, // 1快捷短语  2 申诉
        goods_type: 2, // 1: 'itunes', 2: '礼品卡'
      }
    });
  }

  selectTerm = e => {
    if (!CONFIG.term) {
      return false;
    }
    this.setState({
      term: CONFIG.term[CONFIG.term.findIndex(t => t.id === e)].content || '-',
    });
    console.log(e);
    this.props.dispatch({
      type: 'card/sendQuickMsg',
      payload: {
        order_id: 'orderId',
        quick_message_id: e,
      },
    });
  };

  sendQuickMsg = (e) =>{
    const { order = {} } = this.props.detail;
    if (e) {
      this.props.dispatch({
        type: 'send_message',
        payload: {
          order_id: order.id,
          quick_msg_id: e.id,
          content: e.content,
        },
      });
    }
  }

  render() {
    const { setStatus, card: { quickMsgList = [] } } = this.props;
    const { ad, cards, order, trader } = this.props.detail;

    const userInfo = ad.owner;

    return (
      <div className={styles.chatInfo}>
        <Select
          defaultValue={this.state.term}
          style={{ width: 260 }}
          onSelect={this.sendQuickMsg}
        >
          {CONFIG.term
            ? CONFIG.term.map(t => {
                return (
                  <Option key={t.id} value={t}>
                    {t.content}
                  </Option>
                );
              })
            : null}
        </Select>
        <ul>
          {
             map(quickMsgList, d => {
              return (
                <li>
                  <div className={styles.leftAvatar}>
                    <span className={styles.avaTop}>
                      <Avatar className={styles.avatar} src={d.sender && d.sender.avatar} size="large" icon="user" />
                    </span>
                    <span className={styles.avaName}>{d.sender && d.sender.nickname}</span>
                  </div>
                  <div className={styles.chatItem}>
                    <p className={styles.chatText}>
                      {d.content && d.content.content}
                    </p>
                    <div className={styles.chatTime}>{moment(d.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                  </div>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}
