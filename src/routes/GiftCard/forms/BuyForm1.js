import React, { Component, Fragment } from 'react';
import {
  Select,
  Button,
  Icon,
  Input,
  message,
  Form,
  InputNumber,
  Radio,
  Modal,
  Row,
  Col,
} from 'antd';
import { map, mapKeys, cloneDeep, filter, head, mapValues, get } from 'lodash';
import styles from './SellForm.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

const dataItem = {
  money: null,
  min_count: null,
  max_count: null,
};

const uuid = 0;
@Form.create({
  mapPropsToFields(props) {
    console.log(props.initialValues.condition);
    // return {
    //   // username: Form.createFormField({
    //   //   value: props.initialValues.username,
    //   // }),
    //   condition: Form.createFormField({
    //     ...props.initialValues.condition,
    //     value: props.initialValues.condition,
    //   }),
    // };
    return Object.keys(props.initialValues).reduce((acc, cv, ci) => {
      return {
        ...acc,
        [cv]: Form.createFormField({
          value: props.initialValues[cv],
        }),
      };
    }, {});
  },
})
export default class BuyForm extends Component {
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values);
    });
  };

  addAbc = index => {
    const condition = this.props.form.getFieldValue('condition');

    // const items = condition[index].items; //this.props.form.getFieldValue(`condition[${index}].items`);

    condition[index].items.push({ abc: 1001 });
    const formKey = `condition[${index}].items`;
    this.props.form.getFieldDecorator(formKey, { initialValue: condition[index] });
  };

  setFieldValue = (form, key, value) => {
    let obj = {};
    obj[key] = value;
    form.setFieldsValue(obj);
  };

  removeAbc = index => {
    // const items = this.props.form.getFieldValue(`condition[${index}].items`);
    // const condition = this.props.form.getFieldValue('condition');

    const items = this.props.form.getFieldValue(`condition[${index}].items`);

    items.splice(index, 1);
    // const formKey = `condition[${index}].items`;
    // this.props.form.getFieldDecorator(formKey, { initialValue: condition[index].items });
    console.log(items);
    this.props.form.setFieldsValue({
      [`condition[${index}].items`]: items,
    });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, getFieldsValue },
      initialValues,
    } = this.props;
    console.log(getFieldsValue());
    // getFieldDecorator('condition',{initialValue: initialValues.condition});
    const condition = getFieldValue('condition');

    const fields = map(condition, (item, key) => {
      // getFieldDecorator(`condition[${+key}].items`,{initialValue: item.items})
      const subItem = item.items || []; //getFieldValue(`condition[${+key}].items`);
      const subFields = map(subItem, (i, k) => {
        return (
          <FormItem key={k} label="abc">
            {getFieldDecorator(`condition[${+key}].items[${+k}].abc`, {
              initialValue: get(i, 'abc'),
              rules: [{ required: true, message: 'required!' }],
            })(<Input />)}
            <a onClick={() => this.removeAbc(key, k)}>delete</a>
          </FormItem>
        );
      });
      // console.log( get(item, 'max.abc'))
      return (
        <Fragment key={key}>
          <FormItem label={`condition${key}.money`}>
            {getFieldDecorator(`condition[${key}].money`, {
              initialValue: item.money,
              rules: [{ required: true, message: 'required!' }],
            })(<Input />)}
          </FormItem>
          <FormItem label={`condition${key}.count`}>
            {getFieldDecorator(`condition[${key}].count`, {
              initialValue: item.count,
              rules: [{ required: true, message: 'required!' }],
            })(<Input />)}
          </FormItem>
          <FormItem label="maxABC">
            {getFieldDecorator(`condition[${key}].max.abc`, {
              initialValue: get(item, 'max.abc'),
              rules: [{ required: true, message: 'required!' }],
            })(<Input />)}
          </FormItem>
          {subFields}
          <a onClick={() => this.addAbc(key)}>添加</a>
        </Fragment>
      );
    });

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="Username">
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Username is required!' }],
          })(<Input />)}
        </FormItem>
        {fields}
        <Button type="primary" htmlType="submit">
          save
        </Button>
      </Form>
    );
  }
}
