import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Divider } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import { delay } from 'lodash';
import CheckEmailForm from '../forms/EmailForm';
import styles from './EmailModal.less';

const { Step } = Steps;

export default class EmailModal extends Component {
  static defaultProps = {
    className: '',
    title: <FM id="emailModal.email_bind" defaultMessage="邮箱绑定" /> ,
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

  handleCheckSubmit = (err, { email, captcha }) => {
    if (!err) {
      this.props.dispatch({
        type: 'global/verifyCaptcha',
        payload: {
          data: {
            mail: email,
          },
          type: 'mail',
          code: captcha,
          usage: 2,
        },
        callback: (data = {}) => {
          this.setState({
            current: this.state.current + 1,
            updateKey: data.verify_token,
          });
        },
      });
    }
  };

  handleBindSubmit = (err, { captcha: code, email }) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitChangeEmail',
        payload: {
          email,
          code,
          verify_token: this.state.updateKey,
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

  handleSendCaptcha = (usage = 2, { email }, callback) => {
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: {
        data: {
          mail: email,
        },
        type: 'mail',
        usage,
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
        title: <FM id="emailModal.email_old_verify" defaultMessage="验证旧邮箱" />,
        hide: !user.email,
        component: (
          <CheckEmailForm
            key="1"
            onGetCaptcha={this.handleSendCaptcha.bind(this, 2)}
            initialValue={user}
            disabled
            onSubmit={this.handleCheckSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: <FM id="emailModal.email_new_bind" defaultMessage="绑定新邮箱" />,
        component: (
          <CheckEmailForm
            key="2"
            onGetCaptcha={this.handleSendCaptcha.bind(this, 3)}
            onSubmit={this.handleBindSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: <FM id="emailModal.email_bind_finish" defaultMessage="完成" />,
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
