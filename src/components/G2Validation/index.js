import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import classNames from 'classnames';
import styles from './index.less';

const FormItem = Form.Item;

class G2Validation extends Component {
  static defaultProps = {
    className: '',
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {};

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      this.props.onSubmit(err, values);
    });
  };
  render() {
    const { className, form, submitting, visible, title } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        width={360}
        title={title}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            <FM id='UserLogin.G2_cancel' defaultMessage='取消' />
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            <FM id='UserLogin.G2_confirm' defaultMessage='确定' />
          </Button>,
        ]}
      >
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: <FM id='UserLogin.G2_inputGoogle_code' defaultMessage='请输入谷歌验证码' />,
                  },
                ],
              })(<Input autoFocus size="large" placeholder={(PROMPT('UserLogin.G2_Google_code')||'谷歌验证码')} />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(G2Validation);
