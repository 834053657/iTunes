import React, {Component, Fragment} from 'react';
import {Form, Button} from 'antd';
import {FormattedMessage as FM, defineMessages} from 'react-intl';
import {injectIntl} from 'components/_utils/decorator';
import InputNumber from 'components/InputNumber';
import styles from './PriceForm.less';

const FormItem = Form.Item;

const msg = defineMessages({
  input_amount_num: {
    id: 'PriceForm.input_amount_num',
    defaultMessage: '请输入面额',
  },
  extra: {
    id: 'PriceForm.extra',
    defaultMessage: '可添加面额 {min} - {max}',
  },
});

@injectIntl()
@Form.create()
export default class PriceForm extends Component {
  state = {};

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit && this.props.onSubmit(values.price);
        this.props.form.resetFields();
      }
    });
  };

  // checkCount = (rule, value, callback) => {
  //   const { multiple = 0} = this.props;
  //   if (value && value%multiple !== 0) {
  //     callback(`数量必须是${multiple}的倍数`);
  //   }else {
  //     callback();
  //   }
  // };

  render() {
    const {intl, form: {getFieldDecorator, resetForm, getFieldsError}, min, max} = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          extra={
            <FM
              {...msg.extra}
              values={{min, max}}
            />
          }
        >
          {getFieldDecorator('price', {
            rules: [
              {
                required: true,
                //message: <FM id="PriceForm.input_amount_num" defaultMessage="请输入面额"/>,
                message: "请输入面额"
              },
              {
                type: 'number',
                min,
                max,
                // message: (<FM {...msg.extra} values={{ min, max }}/>),
                message: `面额值范围应在${min}-${max}`
          },
            // {
            //   validator: this.checkCount,
            // },
            ],
          })(<InputNumber precision={0} style={{width: 200}} placeholder={intl.formatMessage(msg.input_amount_num)} />)}
        </FormItem>
        <FormItem className={styles.buttonBox}>
          <Button key="back" onClick={this.handleCancel}>
            <FM id="PriceForm.amount_add_input_cancel" defaultMessage="取消" />
          </Button>
          <Button
            // loading={submitting}
            style={{marginLeft: 15}}
            type="primary"
            htmlType="submit"
          >
            <FM id="PriceForm.amount_add_input_submit" defaultMessage="添加" />
          </Button>
        </FormItem>
      </Form>
    );
  }
}
