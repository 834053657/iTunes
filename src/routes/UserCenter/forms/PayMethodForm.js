import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { FormattedMessage as FM } from 'react-intl';

import { Form, Input, Button, Popover, Select } from 'antd';
import { omit, map, keys } from 'lodash';
import styles from './PayMethodForm.less';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ user, loading }) => ({
  result: user.changePassword.result,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class PayMethodForm extends Component {
  static defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };
  state = {};

  constructor(props) {
    super(props);
    const { payment_detail = {} } = props.initialValues || {};

    this.state = {
      formItemLayout: {
        labelCol: {
          sm: { span: 6 },
        },
        wrapperCol: {
          sm: { span: 18 },
        },
      },
      fieldList: {
        wechat: {
          'payment_detail.name': {
            lablel: <FM id="payMethodForm.payer_name" defaultMessage="姓名" />,
            component: <Input size="large" maxLength={20} />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: <FM id="payMethodForm.payer_name_input" defaultMessage="请输入姓名！" />,
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: <FM id="payMethodForm.payer_account" defaultMessage="账号" />,
            component: <Input size="large" maxLength={30} />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: <FM id="payMethodForm.payer_account_input" defaultMessage="请输入账号！" />,
                },
                {
                  pattern: /^[0-9]{4,30}$/,
                  message: <FM id="payMethodForm.payer_account_input_limit" defaultMessage="请输入4~30位的数字" />,
                },
              ],
            },
          },
        },
        alipay: {
          'payment_detail.name': {
            lablel: <FM id="payMethodForm.user_name" defaultMessage="姓名" />,
            component: <Input size="large" maxLength={20} />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: <FM id="payMethodModal.user_name_input" defaultMessage="请输入姓名！" />,
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: <FM id="payMethodModal.user_account" defaultMessage="账号" />,
            component: <Input size="large" maxLength={30} />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: <FM id="payMethodModal.user_account_input" defaultMessage="请输入账号！" />,
                },
                // {
                //   pattern: /^[0-9]{4,30}$/,
                //   message: <FM id="payMethodModal.num_amount_limit" defaultMessage="请输入4~30位的数字" />,
                // },
              ],
            },
          },
        },
        bank: {
          'payment_detail.name': {
            lablel: <FM id="payMethodModal.bank_name" defaultMessage="姓名" />,
            component: <Input size="large" maxLength={20} />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: <FM id="payMethodModal.name_input" defaultMessage="请输入姓名！" />,
                },
              ],
            },
          },
          'payment_detail.bank_name': {
            lablel: <FM id="payMethodModal.bank_open" defaultMessage="开户行" />,
            component: <Input size="large" maxLength={20}  />,
            options: {
              initialValue: payment_detail.bank_name,
              rules: [
                {
                  required: true,
                  message: <FM id="payMethodModal.bank_open_input" defaultMessage="请输入开户行！" />,
                },
              ],
            },
          },
          'payment_detail.bank_account': {
            lablel: <FM id="payMethodModal.bank_card_num" defaultMessage="银行卡号" />,
            component: <Input size="large" maxLength={30} />,
            options: {
              initialValue: payment_detail.bank_account,
              rules: [
                {
                  required: true,
                  message: <FM id="payMethodModal.bank_card_num_input" defaultMessage="请输入银行卡号！" />,
                },
                {
                  pattern: /^[0-9]{4,30}$/,
                  message: <FM id="payMethodModal.bank_card_num_input_limit" defaultMessage="请输入4~30位的数字" />,
                },
              ],
            },
          },
        },
      },
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { getFieldValue } = this.props.form;
    const { fieldList } = this.state;
    const payment_method = getFieldValue('payment_method');
    const fields = payment_method && fieldList[payment_method] ? fieldList[payment_method] : null;

    this.props.form.validateFields(
      [...keys(fields), 'payment_method'],
      { force: true },
      this.props.onSubmit
    );
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  getContent = () => {
    const { formItemLayout, fieldList } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const payment_method = getFieldValue('payment_method');
    const fields = payment_method && fieldList[payment_method] ? fieldList[payment_method] : null;
    const content = (
      <div>
        {map(fields, (item, key) => {
          return (
            <FormItem {...formItemLayout} label={item.lablel} key={key}>
              {getFieldDecorator(key, item.options)(item.component)}
            </FormItem>
          );
        })}
      </div>
    );

    return content;
  };

  render() {
    const { formItemLayout } = this.state;
    const { form, submitting, initialValues = {} } = this.props;
    const { id } = initialValues || {};
    const PAY_MENTS = omit(CONFIG.payments, 'site');
    const { getFieldDecorator } = form;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item {...formItemLayout} label={<FM id="payMethodModal.pay_way_user" defaultMessage="支付方式" />}>
            {getFieldDecorator('payment_method', {
              initialValue: initialValues.payment_method || 'alipay',
              rules: [{ required: true, message: <FM id="payMethodModal.pay_way_choose" defaultMessage="请选择支付方式" /> }],
            })(
              <Select size="large">
                {map(PAY_MENTS, (text, key) => (
                  <Option key={key} value={key}>
                    {text}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {this.getContent()}

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              <FM id="payMethodModal.cancel" defaultMessage="取消" />
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              {id ? <FM id="payMethodModal._update" defaultMessage="更新" /> : <FM id="payMethodModal._insure" defaultMessage="确定" />}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
