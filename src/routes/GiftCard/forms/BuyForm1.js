import React, { PureComponent, Component, Fragment } from 'react';
import { Form, Button, Row, Col, Icon, Radio } from 'antd';
// import AsyncValidator from 'async-validator'
import { map, filter } from 'lodash';
import { connect } from 'dva';
import {
  Field,
  reduxForm,
  formValueSelector,
  getFormValues,
  FieldArray,
  SubmissionError,
} from 'redux-form';
import { validate } from '../../../utils/utils';
import {
  AInput,
  ASelect,
  AOption,
  AInputNumber,
  ARadioGroup,
} from '../../../components/_utils/createField';
import styles from './SellForm.less';

const FormItem = Form.Item;

const descriptor = {
  card_type: {
    required: true,
    message: '请选择类型',
  },
  unit_price: {
    required: true,
    message: '请输入单价',
  },
  multiple: [
    {
      required: true,
      message: '请输入倍数',
    },
    {
      pattern: /^[1-9]\d*$/,
      message: '请输入正整数',
    },
  ],
  condition_type: {
    required: true,
    message: '请选请选择条件类型择类型',
  },
  condition1: {
    type: 'array',
    required: true,
    message: { _error: '请添加面额' },
    defaultField: {
      type: 'object',
      fields: {
        money: [
          {
            required: true,
            message: '请输入面额',
          },
          {
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
          },
        ],
        min_count: { required: true, message: '请输入最小数量' },
        max_count: { required: true, message: '请输入最大数量' },
      },
    },
  },
  condition2: {
    type: 'object',
    fields: {
      min_money: [
        {
          required: true,
          message: '请输入最小面额',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入正整数',
        },
      ],
      max_money: [
        {
          required: true,
          message: '请输入最大面额',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入正整数',
        },
      ],
    },
  },
};
// 根据校验规则构造一个 validator
// const validator = new AsyncValidator(descriptor)

const CardType = filter(CONFIG.card_type, item => item.valid);

class Items extends Component {
  render() {
    const {
      fields,
      meta,
      children,
      hasFeedback,
      label,
      required,
      labelCol,
      wrapperCol,
      colon,
      extra,
      formitemlayout,
      ...rest
    } = this.props;

    const hasError = meta.touched && meta.invalid;
    return (
      <FormItem validateStatus={hasError ? 'error' : 'success'} help={hasError && meta.error}>
        <div>
          <button type="button" onClick={() => fields.push({ price: '', min: '', max: '' })}>
            添加 cards
          </button>
          {hasError && <span>{meta.error}</span>}
        </div>
        {fields.map((member, index) => {
          return (
            <Row key={index}>
              <Col sm={2}>
                <Button icon="close-circle-o" onClick={() => fields.remove(index)}>
                  删除
                </Button>
                <h4>cards #{index + 1}</h4>
              </Col>
              <Col sm={4}>
                <Field name={`${member}.price`} component={AInputNumber} />
              </Col>
              <Col sm={4}>
                <Field name={`${member}.min`} component={AInputNumber} />
              </Col>
              <Col sm={4}>
                <Field name={`${member}.max`} component={AInputNumber} />
              </Col>
              <Col sm={10}>
                <FieldArray name={`${member}.subCards`} component={this.renderSubItem} />
              </Col>
            </Row>
          );
        })}
      </FormItem>
    );
  }
}

@connect(state => {
  return {
    formValues: getFormValues('loginForm')(state),
  };
})
@reduxForm({
  form: 'loginForm', // a unique name for this form
  validate: (values, props) => {
    // return validate(descriptor, values);
    // if (!['john', 'paul', 'george', 'ringo'].includes(values.unit_price)) {
    //     return { unit_price: 'User does not exist' };
    //   }
  },
})
export default class ReduxForm extends PureComponent {
  save = values => {
    // console.log(values);
    // // throw new SubmissionError({"unit_price": '错误1'});
    // throw new SubmissionError({cards: [{},{'price': 'sb13'}]});

    // console.log(values);
    let err = validate(descriptor, values);
    console.log(err);
    if (err) {
      throw new SubmissionError(err);
    }
    values.condition = values[`condition${values.condition_type}`];

    this.props.onSubmit({
      ...values,
    });
    // throw new SubmissionError({"cards[0].price":"必填"});

    // if (errors) {
    //   return errors
    //   throw new SubmissionError(errors);
    // }
    // console.log(values);
    // return true
    // if (!['john', 'paul', 'george', 'ringo'].includes(values.unit_price)) {
    //   throw new SubmissionError({ unit_price: 'User does not exist', _error: 'Login failed!' });
    // } else if (values.password !== 'redux-form') {
    //   throw new SubmissionError({ password: 'Wrong password', _error: 'Login failed!' });
    // }
  };

  renderItem = arg => {
    const { fields, formitemlayout, meta, _error } = arg;
    return (
      <FormItem
        wrapperCol={{ offset: 4 }}
        validateStatus={meta.error ? 'error' : 'success'}
        help={meta.error && meta.error}
      >
        {fields.map((member, index) => {
          return (
            <Row key={index} style={{ marginBottom: 20 }}>
              <Col sm={4}>
                <Field
                  name={`${member}.money`}
                  component={AInputNumber}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col sm={4} offset={1}>
                <Field
                  name={`${member}.min_count`}
                  component={AInputNumber}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col sm={4} offset={1}>
                <Field
                  name={`${member}.max_count`}
                  component={AInputNumber}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col sm={3} offset={1}>
                <Button icon="close-circle-o" onClick={() => fields.remove(index)}>
                  删除
                </Button>
              </Col>
            </Row>
          );
        })}
        <Button
          type="dashed"
          onClick={() => fields.push({ money: '', min_count: '', max_count: '' })}
        >
          <Icon type="plus" /> 添加面额
        </Button>
      </FormItem>
    );
  };

  handleCancel = () => {
    this.props.form();
    this.props.onCancel && this.props.onCancel();
  };

  render() {
    const { handleSubmit, pristine, reset, submitting, terms = [], formValues } = this.props;
    const { condition_type } = formValues || {};
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    console.log(formValues);

    return (
      <Form onSubmit={handleSubmit(this.save)}>
        <Field
          label="类型"
          name="card_type"
          component={ASelect}
          {...formItemLayout}
          style={{ width: 200 }}
          placeholder="请选择类型"
        >
          {map(CardType, card => {
            return (
              <AOption key={card.type} value={card.type}>
                {card.name}
              </AOption>
            );
          })}
        </Field>
        <Field
          label="单价"
          name="unit_price"
          component={AInputNumber}
          {...formItemLayout}
          precision={2}
        />
        <Field
          label="倍数"
          name="multiple"
          component={AInputNumber}
          {...formItemLayout}
          placeholder=""
        />
        <Field
          label="条件"
          name="condition_type"
          component={ARadioGroup}
          {...formItemLayout}
          placeholder=""
        >
          <Radio.Button value={1}>指定面额</Radio.Button>
          <Radio.Button value={2}>面额区间</Radio.Button>
        </Field>

        {condition_type === 1 ? (
          <FieldArray name="condition1" {...formItemLayout} component={this.renderItem} />
        ) : (
          <Row>
            <Col sm={4} offset={4}>
              <Field
                name="condition2.min_money"
                component={AInputNumber}
                style={{ width: '100%' }}
                placeholder=""
              />
            </Col>
            <Col sm={1} style={{ textAlign: 'center' }}>
              {' '}
              ~{' '}
            </Col>
            <Col sm={4}>
              <Field
                name="condition2.max_money"
                component={AInputNumber}
                style={{ width: '100%' }}
                placeholder=""
              />
            </Col>
          </Row>
        )}

        <Field
          label="要求"
          name="password_type"
          component={ARadioGroup}
          {...formItemLayout}
          placeholder=""
        >
          {map(CONFIG.cardPwdType, (text, value) => (
            <Radio key={value} value={+value}>
              {text}
            </Radio>
          ))}
        </Field>

        <Field
          label="发卡期限"
          name="deadline"
          component={ASelect}
          {...formItemLayout}
          placeholder="请选择发卡期限"
          style={{ width: 200 }}
        >
          {map(CONFIG.deadline, (item, index) => (
            <AOption key={item} value={item}>
              {item}分钟
            </AOption>
          ))}
        </Field>

        <Field
          label="保障时间"
          name="guarantee_time"
          component={ASelect}
          {...formItemLayout}
          placeholder="请选择保障时间"
          style={{ width: 200 }}
        >
          {map(CONFIG.guarantee_time, (item, index) => (
            <AOption key={item} value={item}>
              {item}分钟
            </AOption>
          ))}
        </Field>

        <Field
          label={
            <span>
              交易条款<i>(可选)</i>
            </span>
          }
          name="term_id"
          component={ASelect}
          style={{ width: 200 }}
          {...formItemLayout}
          placeholder="请选择交易条款"
        >
          <AOption value={0}>无</AOption>
          {map(terms, (item, index) => (
            <AOption key={item.id} value={+item.id}>
              {item.title}
            </AOption>
          ))}
        </Field>

        <Field
          label="同时处理订单数"
          name="concurrency_order"
          component={AInputNumber}
          {...formItemLayout}
          placeholder=""
        />

        <Form.Item>
          <Button key="back" onClick={this.handleCancel}>
            返回
          </Button>
          <Button type="primary" className={styles.submit} htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
