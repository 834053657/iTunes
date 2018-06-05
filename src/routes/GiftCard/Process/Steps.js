import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  InputNumber,
  Steps,
  Avatar,
} from 'antd';
import styles from './Steps.less';

const Step = Steps.Step;

@connect(({ card }) => ({
  card,
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <div className={styles.stepBox}>
        <Steps current={2}>
          <Step title="发送礼品卡" />
          <Step title="确认信息" />
          <Step title="完成" />
        </Steps>
      </div>
    );
  }
}
