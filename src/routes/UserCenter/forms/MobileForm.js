import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage as FM } from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import classNames from 'classnames';
import styles from './MobileForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const msg = defineMessages({
  mobile_code_input :{
    id:'mobileForm.mobile_code_input',
    defaultMessage:'验证码'
  }
})
@injectIntl()
@Form.create()
export default class MobileForm extends Component {
  static defaultProps = {
    className: '',
    onGetCaptcha: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onGetCaptcha: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    count: 0,
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSendCaptcha = () => {
    this.props.form.validateFields(
      ['telephone_code', 'telephone'],
      { force: true },
      (err, { telephone, telephone_code }) => {
        if (!err) {
          // const nation_code = CONFIG.countrysMap[telephone_code].nation_code;
          this.props.onGetCaptcha({ nation_code: telephone_code, telephone }, () => {
            let count = 59;
            this.setState({ count });
            this.interval = setInterval(() => {
              count -= 1;
              this.setState({ count });
              if (count === 0) {
                clearInterval(this.interval);
              }
            }, 1000);
          });
        }
      }
    );
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { telephone_code: nation_code, verify_code: code, telephone: phone } = values;
        // const nation_code = CONFIG.countrysMap[telephone_code].nation_code;

        this.props.onSubmit({ nation_code, code, phone });
      }
    });
  };

  render() {
    const { className, form, initialValue = {}, submitting, disabled,intl } = this.props;
    const { count } = this.state;
    // const telephone_code = form.getFieldValue('telephone_code');
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 5 },
      },
      wrapperCol: {
        sm: { span: 19 },
      },
    };

    return (
      <div className={classNames(className, styles.login)}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<FM id="mobileForm.country_" defaultMessage="国家" />}>
            {getFieldDecorator('telephone_code', {
              initialValue: initialValue.telephone_code,
              rules: [
                {
                  required: true,
                  message: <FM id="mobileForm.country_select" defaultMessage="请选择国家！" />,
                },
              ],
            })(
              <Select showSearch optionFilterProp="children" disabled={disabled}>
                {CONFIG.country.map(item => (
                  <Option key={item.code} value={item.nation_code.toString()}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={<FM id="mobileForm.phone_num" defaultMessage="手机号码" />}>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('telephone', {
                  initialValue: initialValue.telephone,
                  rules: [
                    {
                      required: true,
                      message: <FM id="mobileForm.phone_num_input" defaultMessage="请输入手机号码！" />,
                    },
                    {
                      pattern: /^[1-9]\d*$/,
                      message: <FM id="mobileForm.phone_num_input_right" defaultMessage="请输入正确的手机号码" />,
                    },
                  ],
                })(
                  <Input
                    disabled={disabled}
                    className={styles.mobile_input}
                    addonBefore={
                      form.getFieldValue('telephone_code') ? (
                        <span>+{form.getFieldValue('telephone_code')}</span>
                      ) : null
                    }
                    style={{ width: '100%' }}
                  />
                )}
              </Col>
              <Col span={8}>
                <Button
                  disabled={count}
                  className={styles.getCaptcha}
                  size="large"
                  onClick={this.handleSendCaptcha}
                >
                  {count ? `${count} s` : (<FM id="mobileForm.get_code" defaultMessage="获取验证码" />)}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label={<FM id="mobileForm.mobile_code" defaultMessage="验证码" />}>
            {getFieldDecorator('verify_code', {
              rules: [
                {
                  required: true,
                  message: <FM id="mobileForm.mobile_code_input_" defaultMessage="请输入验证码！" />,
                },
              ],
            })(<Input size="large" placeholder={intl.formatMessage(msg.mobile_code_input)} />)}
            {/*验证码*/}
          </FormItem>
          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              <FM id="mobileForm.code_cancel" defaultMessage="取消" />
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              <FM id="mobileForm.next_step" defaultMessage="下一步" />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}


