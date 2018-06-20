import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Button, Icon, Steps, Avatar, Select } from 'antd';
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

  render() {
    const { setStatus } = this.props;
    const { ad, cards, order, trader } = this.props.detail;

    const userInfo = ad.owner;

    return (
      <div className={styles.chatInfo}>
        <Select
          defaultValue={this.state.term}
          style={{ width: 260 }}
          onSelect={e => this.selectTerm(e)}
        >
          {CONFIG.term
            ? CONFIG.term.map(t => {
                return (
                  <Option key={t.id} value={t.id}>
                    {t.content}
                  </Option>
                );
              })
            : null}
        </Select>
        <ul>
          <li>
            <div className={styles.leftAvatar}>
              <span className={styles.avaTop}>
                <Avatar className={styles.avatar} size="large" icon="user" />
              </span>
              <span className={styles.avaName}>Jason</span>
            </div>
            <div className={styles.chatItem}>
              <p className={styles.chatText}>
                您好，请稍等片刻待我确认请稍等片刻待我确认请稍等片刻待我确认
              </p>
              <div className={styles.chatTime}>{new Date().toLocaleDateString()}</div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
