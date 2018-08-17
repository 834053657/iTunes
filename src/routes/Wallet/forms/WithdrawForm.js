import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { map, filter, find, get } from 'lodash';
import { FormattedMessage as FM,defineMessages } from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import classNames from 'classnames';
import PayMethodModal from '../../UserCenter/modals/PayMethodModal';
import styles from './RechargeForm.less';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};
const msg = defineMessages({
  passWord_input_warning_holder: {
    id: 'withdrawForm.passWord_input_warning_holder',
    defaultMessage: '请输入密码',
  },
  cash_amount_inp: {
    id: 'withdrawForm.cash_amount_inp',
    defaultMessage: '提现金额',
  },
  add_pay_way: {
    id: 'withdrawForm.add_pay_way',
    defaultMessage: '添加临时账号',
  },
  chrome_code_input_holder: {
    id: 'withdrawForm.chrome_code_input_holder',
    defaultMessage: '请输入谷歌验证码',
  },
});

@injectIntl()
@Form.create()
export default class WithdrawForm extends Component {
  state = {
    fee: 0,
    addVisible: false,
    tempPayMethod: null
  };
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'wallet/sendWithdraw',
          payload: values,
          callback: res => {
            if (res.code === 0) {
              message.success(
                <FM id="withdrawForm.pay_wait" defaultMessage="已提交提现申请，请等待平台处理" />
              );
              this.setState({
                fee: 0,
              });
              this.props.form.resetFields();
              this.props.onSubmit && this.props.onSubmit();
            } else {
              message.error(res.msg);
            }
          },
        });
      }
    });
  };

  handleGetFee = () => {
    this.props.form.validateFields(['amount', 'payment_id'], { force: true }, (err, value) => {
      const { amount, payment_id } = value;
      if (!err) {
        const target = find(this.getEnabledPayments(), item => item.id === payment_id);

        this.props.dispatch({
          type: 'wallet/fetchFee',
          payload: {
            payment_method: target.payment_method,
            amount,
          },
          callback: (data = {}) => {
            this.setState({
              fee: data.fee,
            });
          },
        });
      }
    });
  };

  getUserAccount = info => {
    const { payment_method, payment_detail = {} } = info || {};
    if (payment_method === 'bank') {
      return payment_detail.bank_account;
    } else {
      return payment_detail.account;
    }
  };

  showPayMethodModal = () => {
    this.setState({
      addVisible: true
    })
  }

  hidePayMethodModal = () => {
    this.setState({
      addVisible: false
    })
  }

  handleOnAddPayMethod = (values) => {
    this.setState({
      tempPayMethod: values,
      addVisible: false
    }, ()=> {
      const { form } = this.props;
      form.setFieldsValue({
        payment_id: values.id,
      });
    })
  }

  getEnabledPayments = () => {
    const { tempPayMethod }  = this.state;
    const payments = get(this.props, 'currentUser.payments');
    const userPayments = filter(payments, i => i.status === 4);

    return tempPayMethod ?  [tempPayMethod, ...userPayments] : userPayments;
  }

  render() {
    const { className, form, submitting, currentUser, intl } = this.props;
    const { getFieldDecorator } = form;
    const { user = {} } = currentUser || {};


    return (
      <div className={classNames(className, styles.form)}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label={<FM id="withdrawForm.cash_account" defaultMessage="提现账号" />}
            extra={<p style={{textAlign: 'right'}}><a onClick={this.showPayMethodModal}>+<FM id="withdrawForm.add_pay_way" defaultMessage="添加临时账号" /></a></p>}
          >
            {getFieldDecorator('payment_id', {
              onChange: this.handleGetFee,
              rules: [
                {
                  required: true,
                  message: (
                    <FM
                      id="withdrawForm.cash_account_choose"
                      defaultMessage="请选择您的提现账号！"
                    />
                  ),
                },
              ],
            })(
              <Select
                size="large"
                placeholder={
                  <FM
                    id="withdrawForm.cash_account_choose_inp"
                    defaultMessage="请选择您的提现账号"
                  />
                }
              >
                {map(this.getEnabledPayments(), item => (
                  <Option key={item.id} value={item.id}>
                    <span>
                      {item.temp ? <span>(<FM id="withdrawForm.temp" defaultMessage="临时" />)</span> : null}
                      {item.payment_method && CONFIG.payments[item.payment_method]
                        ? CONFIG.payments[item.payment_method]
                        : item.payment_method}
                      <span> - </span>
                      {this.getUserAccount(item)}
                    </span>
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label={<FM id="withdrawForm.cash_amount" defaultMessage="提现金额" />}
          >
            {getFieldDecorator('amount', {
              rules: [
                {
                  required: true,
                  message: (
                    <FM id="withdrawForm.cash_amount_input" defaultMessage="请输入提现金额！" />
                  ),
                },
              ],
            })(
              <InputNumber
                onBlur={this.handleGetFee}
                // formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value.replace(/￥\s?|(,*)/g, '')}
                style={{ width: '100%' }}
                precision={2}
                size="large"
                // placeholder={<FM id="withdrawForm.cash_amount_inp" defaultMessage="提现金额" />}
                placeholder={this.props.intl.formatMessage(msg.cash_amount_inp)}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FM id="withdrawForm.service_charge" defaultMessage="手续费" />}
          >
            <span className="text-blue">{`¥ ${this.state.fee}`}</span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FM id="withdrawForm.passWord_input" defaultMessage="输入密码" />}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: (
                    <FM id="withdrawForm.passWord_input_warning" defaultMessage="请输入密码！" />
                  ),
                },
              ],
            })(
              <Input
                type="password"
                size="large"
                placeholder={
                  this.props.intl.formatMessage(msg.passWord_input_warning_holder)
                }
              />
            )}
          </FormItem>
          {user.g2fa_on ? (
            <FormItem
              {...formItemLayout}
              label={<FM id="withdrawForm.chrome_code" defaultMessage="谷歌验证" />}
            >
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: (
                      <FM id="withdrawForm.chrome_code_input" defaultMessage="请输入谷歌验证码！" />
                    ),
                  },
                ],
              })(
                <Input
                  style={{ width: '100%' }}
                  size="large"
                  placeholder={
                    this.props.intl.formatMessage(msg.chrome_code_input_holder)
                  }
                />
              )}
            </FormItem>
          ) : null}
          <FormItem className={styles.buttonBox}>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              <FM id="withdrawForm.submit" defaultMessage="提交" />
            </Button>
          </FormItem>
        </Form>

        <PayMethodModal
          {...this.props}
          temp
          title={intl.formatMessage(msg.add_pay_way)}
          data={this.state.addVisible}
          onSubmit={this.handleOnAddPayMethod}
          onCancel={this.hidePayMethodModal}
        />
      </div>
    );
  }
}
