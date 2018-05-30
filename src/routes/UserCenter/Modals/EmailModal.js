import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Divider } from 'antd';
import CheckEmailForm from '../forms/EmailForm';
import styles from './EmailModal.less';

const { Step } = Steps;

class EmailForm extends Component {
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
  };

  handleCheckSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'global/verifyCaptcha',
        payload: {
          ...values,
        },
        callback: () => {
          this.setState({
            current: this.state.current + 1,
          });
        },
      });
    }
  };

  handleBindSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitChangeEmail',
        payload: {
          ...values,
        },
        callback: () => {
          this.setState({
            current: this.state.current + 1,
          });
          setTimeout(this.props.onCancel, 1000);
        },
      });
    }
  };

  handleSendCaptcha = (values, callback) => {
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: { ...values },
      callback,
    });
  };

  render() {
    const { className, form, submitting, visible, title, email, onCancel } = this.props;
    const { current } = this.state;
    let steps = [
      {
        title: '验证旧邮箱',
        hide: !email,
        component: (
          <CheckEmailForm
            key="1"
            onGetCaptcha={this.handleSendCaptcha}
            initialValue={email}
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

export default EmailForm;
