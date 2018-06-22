import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Steps,
  Divider,
  Select,
  InputNumber,
  message,
} from 'antd';
import { map } from 'lodash';
import classNames from 'classnames';
import styles from './RechargeForm.less';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

class RechargeForm extends Component {
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

  constructor(props) {
    super(props);
    props.dispatch({
      type: 'wallet/fetchSysPayments',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'wallet/sendRecharge',
          payload: values,
          callback: res => {
            if (res.code === 0) {
              message.success('充值成功');
              this.props.form.resetFields();
            } else {
              message.success(res.msg);
            }
          },
        });
      }
    });
  };

  renderPaymentInfo = () => {
    const { form, sysPayments } = this.props;
    const id = form.getFieldValue('platform_payment_id');
    if (!id) {
      return null;
    }

    const { payment_detail = {}, payment_method } = (id && sysPayments[id]) || {};

    if (payment_method === 'bank') {
      return (
        <div>
          <FormItem {...formItemLayout} label="平台账号">
            <span>{payment_detail.bank}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="开户人">
            <span>{payment_detail.name}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="开户行">
            <span>{payment_detail.cardno}</span>
          </FormItem>
        </div>
      );
    } else {
      return (
        <FormItem {...formItemLayout} label="收款二维码">
          <img className={styles.qrcode} src={payment_detail.qrcode} alt="收款二维码" />
        </FormItem>
      );
    }
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
    const { className, form, rechargSubmitting, sysPayments = [], currentUser } = this.props;
    const { getFieldDecorator } = form;
    const { payments: userPayments } = currentUser || {};

    return (
      <div className={classNames(className, styles.form)}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="充值方式">
            {getFieldDecorator('platform_payment_id', {
              rules: [
                {
                  required: true,
                  message: '请选择充值方式！',
                },
              ],
            })(
              <Select size="large" placeholder="选择充值方式">
                {map(sysPayments, ({ id, payment_method }) => (
                  <Option key={id} value={id}>
                    {payment_method && CONFIG.payments[payment_method]
                      ? CONFIG.payments[payment_method]
                      : payment_method}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {this.renderPaymentInfo()}
          <FormItem {...formItemLayout} label="充值账号">
            {getFieldDecorator('user_payment_id', {
              rules: [
                {
                  required: true,
                  message: '请选择您的充值账号！',
                },
              ],
            })(
              <Select size="large" placeholder="请选择您的充值账号">
                {map(userPayments, item => (
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
          <FormItem {...formItemLayout} label="充值金额">
            {getFieldDecorator('amount', {
              rules: [
                {
                  required: true,
                  message: '请输入充值金额！',
                },
              ],
            })(
              <InputNumber
                precision={2}
                style={{ width: '100%' }}
                size="large"
                placeholder="充值金额"
              />
            )}
          </FormItem>
          <FormItem className={styles.buttonBox}>
            <Button
              loading={rechargSubmitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(RechargeForm);
