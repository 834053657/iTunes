import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Divider } from 'antd';
import {injectIntl} from 'components/_utils/decorator';
import { FormattedMessage as FM ,defineMessages} from 'react-intl';
import { delay } from 'lodash';
import MobileForm from '../forms/MobileForm';
import styles from './EmailModal.less';

const { Step } = Steps;
const msg = defineMessages({
  phone_bind: {
    id: 'mobileModal.phone_bind',
    defaultMessage: '手机绑定',
  },
  phone_check: {
    id: 'mobileModal.phone_check_',
    defaultMessage: '验证旧手机',
  },
  phone_bind_new: {
    id: 'mobileModal.phone_bind_new',
    defaultMessage: '绑定新手机',
  },
  phone_bind_finish: {
    id: 'mobileModal.phone_bind_finish',
    defaultMessage: '完成',
  },
});

@injectIntl()
export default class MobileModal extends Component {
  static defaultProps = {
    className: '',
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onCancel: PropTypes.func,
  };

  state = {
    current: 0,
    verify_token: null,
  };

  handleCheckSubmit = ({ code, nation_code, phone }) => {
    this.props.dispatch({
      type: 'global/verifyCaptcha',
      payload: {
        data: {
          nation_code,
          phone,
        },
        type: 'sms',
        code,
        usage: 4,
      },
      callback: data => {
        this.setState({
          current: this.state.current + 1,
          verify_token: data.verify_token,
        });
      },
    });
  };

  handleBindSubmit = values => {
    // this.setState({
    //   current: this.state.current + 1,
    // });
    // delay(this.props.onCancel, 1000);
    this.props.dispatch({
      type: 'user/submitChangeMobile',
      payload: {
        ...values,
        verify_token: this.state.verify_token,
      },
      callback: () => {
        // this.setState({
        //   current: this.state.current + 1,
        // });
        this.props.onCancel();
        // delay(this.props.onCancel, 1000);
      },
    });
  };

  handleSendCaptcha = (usage, { nation_code, telephone: phone }, callback) => {
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: {
        type: 'sms',
        usage,
        data: {
          nation_code,
          phone,
        },
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
        title:this.props.intl.formatMessage(msg.phone_check),
        hide: !user.telephone,
        component: (
          <MobileForm
            key="1"
            onGetCaptcha={this.handleSendCaptcha.bind(this, 4)}
            initialValue={user}
            disabled
            onSubmit={this.handleCheckSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: this.props.intl.formatMessage(msg.phone_bind_new),
        component: (
          <MobileForm
            key="2"
            onGetCaptcha={this.handleSendCaptcha.bind(this, 5)}
            onSubmit={this.handleBindSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: this.props.intl.formatMessage(msg.phone_bind_finish),

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
