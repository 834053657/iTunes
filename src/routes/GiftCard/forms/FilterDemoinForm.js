import React, { Component, Fragment } from 'react';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  Card,
  Form,
  InputNumber,
} from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import styles from './FilterDemoinForm.less';

const InputGroup = Input.Group;
const FormItem = Form.Item;
const msg = defineMessages({
  error_msg: {
    id: 'FilterDemoinForm.error_msg',
    defaultMessage: '查询条件不正确!',
  },
  filter_amount: {
    id: 'FilterDemoinForm.filter_amount',
    defaultMessage: '筛选面额',
  },
  reSet: {
    id: 'FilterDemoinForm.reSet',
    defaultMessage: '重置',
  },
  sure_Btn: {
    id: 'FilterDemoinForm.sure_Btn',
    defaultMessage: '确定',
  },

});
@injectIntl()
@Form.create()
export default class FilterDemoinForm extends Component {
  state = {};

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  checkMin = (rule, value, callback) => {
    const { form } = this.props;
    const max = form.getFieldValue('max');
    if (value && max && value > max) {
      callback(this.props.intl.formatMessage(msg.error_msg));
    } else {
      if (max) {
        // form.validateFields(['max'], { force: true });
      }
      callback();
    }
  };

  checkMax = (rule, value, callback) => {
    const { form } = this.props;
    const min = form.getFieldValue('min');
    if (value && min && value < min) {
      callback(this.props.intl.formatMessage(msg.error_msg));
    } else {
      if (min) {
        form.validateFields(['min'], { force: true });
      }
      callback();
    }
  };

  render() {
    const { form: { getFieldDecorator, resetForm, getFieldsError }, initialValues } = this.props;
    const { min, max } = initialValues || {};

    return (
      <Card title={this.props.intl.formatMessage(msg.filter_amount)} className={styles.card}>
        <Form className={styles.denoRange} onSubmit={this.handleSubmit}>
          <InputGroup compact>
            <FormItem>
              {getFieldDecorator('min', {
                initialValue: min,
                rules: [
                  {
                    validator: this.checkMin,
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  style={{ width: 80, textAlign: 'center', backgroundColor: '#fff' }}
                />
              )}
            </FormItem>
            <FormItem>
              <Input
                style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
                placeholder="~"
                disabled
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('max', {
                initialValue: max,
                rules: [
                  {
                    validator: this.checkMax,
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  style={{ width: 80, textAlign: 'center', backgroundColor: '#fff' }}
                />
              )}
            </FormItem>
          </InputGroup>
          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              {this.props.intl.formatMessage(msg.reSet)}
            </Button>
            <Button className={styles.submit} type="primary" htmlType="submit">
              {this.props.intl.formatMessage(msg.sure_Btn)}
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}
