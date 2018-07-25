import React, { Component, Fragment } from 'react';
import { filter, last } from 'lodash';
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
import styles from './FilterDemoinForm.less';
import SellForm from './SellForm';
import PicUpload from '../../../components/UploadQiNiu/index';

const InputGroup = Input.Group;
const FormItem = Form.Item;

@Form.create()
export default class OnlyPassWord extends Component {
  state = {};

  checkMin = (rule, value, callback) => {
    const { form } = this.props;
    const max = form.getFieldValue('max');
    if (value && max && value > max) {
      callback('查询条件不正确!');
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
      callback('查询条件不正确!');
    } else {
      if (min) {
        form.validateFields(['min'], { force: true });
      }
      callback();
    }
  };

  handleDelete = id => {
    const items = this.props.form.getFieldValue('items[]');
    const newItems = filter(items, i => i.id !== id);
    console.log(newItems, items);
    this.props.form.setFieldsValue({
      'items[]': newItems,
    });
  };

  handleAdd = (c, i) => {
    this.props.addMoney(i);
  };

  render() {
    const { form: { getFieldDecorator, getFieldValue, resetForm }, psw } = this.props;

    const formItemLayoutBtn = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    const cards = this.props.defaultValue;
    console.log(cards);
    const cardItems = cards.map((c, index) => {
      return (
        <Card
          key={c.money}
          title={
            <div>
              <span>{c.money}面额</span>
              <span>({c.items.length})</span>
            </div>
          }
          className={styles.card}
        >
          {c.items.map((card, littleIndex) => {
            return (
              <div key={littleIndex}>
                {//密码
                (psw === 1 || psw === 3) && (
                  <FormItem required={false}>
                    {getFieldDecorator(`cards[${index}].items[${littleIndex}].password`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入面额',
                        },
                      ],
                    })(
                      <Input
                        onChange={e => this.props.changePsw(e, index, littleIndex)}
                        placeholder="面额"
                        min={1}
                      />
                    )}
                  </FormItem>
                )}

                {//图片
                (psw === 2 || psw === 3) && (
                  <FormItem required={false}>
                    {getFieldDecorator(`cards[${index}].items[${littleIndex}].picture`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: '请输入面额',
                        },
                      ],
                    })(<PicUpload onChange={e => this.props.changePic(e, index, littleIndex)} />)}
                  </FormItem>
                )}
              </div>
            );
          })}

          <FormItem {...formItemLayoutBtn}>
            <Button type="dashed" onClick={() => this.handleAdd(c, index)} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加卡密
            </Button>
          </FormItem>
        </Card>
      );
    });

    return <div>{cardItems}</div>;
  }
}
