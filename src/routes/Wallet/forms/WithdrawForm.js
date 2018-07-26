import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select, InputNumber, message } from 'antd';
import { map, filter, find } from 'lodash';
import classNames from 'classnames';
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

class WithdrawForm extends Component {
  state = {
    fee: 0,
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
              message.success('已提交提现申请，请等待平台处理');
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
    console.log('abc');
    const { form, currentUser } = this.props;

    this.props.form.validateFields(['amount', 'payment_id'], { force: true }, (err, value) => {
      const { amount, payment_id } = value;
      if (!err) {
        const { payments } = currentUser || {};
        const target = find(payments, item => item.id === payment_id);

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

  render() {
    const { className, form, submitting, currentUser } = this.props;
    const { getFieldDecorator } = form;
    const { payments: userPayments, user = {} } = currentUser || {};

    return (
      <div className={classNames(className, styles.form)}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="提现账号">
            {getFieldDecorator('payment_id', {
              onChange: this.handleGetFee,
              rules: [
                {
                  required: true,
                  message: '请选择您的提现账号！',
                },
              ],
            })(
              <Select size="large" placeholder="请选择您的提现账号">
                {map(filter(userPayments, i => i.status === 4), item => (
                  <Option key={item.id} value={item.id}>
                    <span>
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

          <FormItem {...formItemLayout} label="提现金额">
            {getFieldDecorator('amount', {
              rules: [
                {
                  required: true,
                  message: '请输入提现金额！',
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
                placeholder="提现金额"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手续费">
            <span className="text-blue">{`¥ ${this.state.fee}`}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="输入密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码！',
                },
              ],
            })(<Input type="password" size="large" placeholder="请输入密码" />)}
          </FormItem>
          {user.g2fa_on ? (
            <FormItem {...formItemLayout} label="谷歌验证">
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: '请输入谷歌验证码！',
                  },
                ],
              })(<Input style={{ width: '100%' }} size="large" placeholder="请输入谷歌验证码" />)}
            </FormItem>
          ) : null}
          <FormItem className={styles.buttonBox}>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(WithdrawForm);
