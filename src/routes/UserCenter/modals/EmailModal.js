import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Divider } from 'antd';
import { delay } from 'lodash';
import CheckEmailForm from '../forms/EmailForm';
import styles from './EmailModal.less';

const { Step } = Steps;

export default class EmailModal extends Component {
  static defaultProps = {
    className: '',
    title: '邮箱绑定',
    onCancel: () => {},
  };
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
  };

  state = {
    current: 0,
    updateKey: null,
  };

  handleCheckSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'global/verifyCaptcha',
        payload: {
          ...values,
          type: 1, // 验证码类型 1：邮箱
        },
        callback: (data = {}) => {
          this.setState({
            current: this.state.current + 1,
            updateKey: data.key,
          });
        },
      });
    }
  };

  handleBindSubmit = (err, values) => {
    console.log(values);
    if (!err) {
      this.props.dispatch({
        type: 'user/submitChangeEmail',
        payload: {
          ...values,
          key: this.state.updateKey,
        },
        callback: () => {
          this.setState({
            current: this.state.current + 1,
          });
          delay(this.props.onCancel, 1000);
        },
      });
    }
  };

  handleSendCaptcha = (values, callback) => {
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: {
        ...values,
        type: 1,
        usage: 2,
      },
      callback,
    });
  };

  render() {
    const { className, form, submitting, visible, title, currentUser, onCancel } = this.props;
    const { user = {} } = currentUser || {};
    const { current } = this.state;
    let steps = [
      {
        title: '验证旧邮箱',
        hide: !user.email,
        component: (
          <CheckEmailForm
            key="1"
            onGetCaptcha={this.handleSendCaptcha}
            initialValue={user}
            disabled
            onSubmit={this.handleCheckSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: '绑定新邮箱',
        component: (
          <CheckEmailForm
            key="2"
            onGetCaptcha={this.handleSendCaptcha}
            onSubmit={this.handleBindSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: '完成',
      },
    ];

    steps = steps.filter(item => !item.hide);

    return (
      <Modal
        width={500}
        title={title}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
        footer={null}
      >
        <Steps current={current} className={styles.steps}>
          {steps.map(item => {
            return !item.hide ? <Step key={item.title} title={item.title} /> : null;
          })}
        </Steps>
        <Divider />
        {steps[current] && steps[current].component}
      </Modal>
    );
  }
}
