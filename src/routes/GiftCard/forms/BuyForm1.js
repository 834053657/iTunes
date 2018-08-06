import React, { PureComponent, Component, Fragment } from 'react';
import { Form, Button, Row, Col, Icon, Radio, Popconfirm } from 'antd';
// import AsyncValidator from 'async-validator'
import { map, filter, omit, forEach, size } from 'lodash';
import { connect } from 'dva';
import {
  Field,
  reduxForm,
  formValueSelector,
  getFormValues,
  FieldArray,
  SubmissionError,
  FormSection,
} from 'redux-form';
import { validate, parseNumber, createError } from '../../../utils/utils';
import {
  AInput,
  ASelect,
  AOption,
  AInputNumber,
  ARadioGroup,
} from '../../../components/_utils/createField';
import styles from './SellForm.less';

const FormItem = Form.Item;

// 根据校验规则构造一个 validator
// const validator = new AsyncValidator(descriptor)

@connect(state => {
  return {
    condition_type: formValueSelector('loginForm')(state, 'condition_type'),
    condition2: formValueSelector('loginForm')(state, 'condition2') || {},
  };
})
@reduxForm({
  form: 'loginForm', // a unique name for this form
})
export default class ReduxForm extends PureComponent {
  descriptor = {
    card_type: {
      required: true,
      message: '请选择类型',
    },
    unit_price: {
      required: true,
      type: 'number',
      message: '请输入单价',
    },
    multiple: [
      {
        required: true,
        type: 'number',
        message: '请输入倍数',
      },
      {
        pattern: /^[1-9]\d*$/,
        message: '请输入正整数',
      },
    ],
    condition_type: {
      required: true,
      message: '请选择条件类型',
    },
    condition1: {
      type: 'array',
      required: true,
      message: { _error: '请添加指定面额' },
      defaultField: {
        type: 'object',
        fields: {
          money: [
            {
              required: true,
              type: 'number',
              message: '请输入面额',
            },
          ],
          min_count: [{ required: true, type: 'number', message: '请输入最小数量' }],
          max_count: { required: true, type: 'number', message: '请输入最大数量' },
        },
      },
    },
    condition2: {
      type: 'object',
      required: true,
      message: { _error: '请填写' },
      fields: {
        min_money: [
          {
            required: true,
            type: 'number',
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
            type: 'number',
            message: '请输入最大面额',
          },
          {
            pattern: /^[1-9]\d*$/,
            message: '请输入正整数',
          },
        ],
      },
    },
    deadline: {
      required: true,
      message: '请选择发卡期限',
    },
    guarantee_time: {
      required: true,
      message: '请选择保障时间',
    },
    password_type: {
      required: true,
      message: '请输入选择密保卡类型',
    },
  };

  save = values => {
    const { condition_type } = this.props;
    const rules = omit(this.descriptor, condition_type === 1 ? 'condition2' : 'condition1');
    const err = validate(rules, values);
    const checkErr = {};
    if (err) {
      throw new SubmissionError(err);
    }

    if (condition_type === 1) {
      forEach(values.condition1, (value, key) => {
        if (value.min_count > value.max_count) {
          createError(checkErr, `condition1.${key}.min_count`, '该数值应小于右侧值');
        }
      });
      values.condition = values.condition1;
    } else {
      if (values.condition2.min_money > values.condition2.max_money) {
        createError(checkErr, `condition2.min_money`, '该数值应小于右侧值');
      }

      values.condition = values.condition2;
    }

    if (size(checkErr) > 0) {
      throw new SubmissionError(checkErr);
    }
    const params = omit(values, ['condition2', 'condition1']);

    this.props.onSubmit(params);
  };

  renderItem = arg => {
    const { fields, formitemlayout, meta, _error, disabled, editing } = arg;
    return (
      <FormItem
        wrapperCol={{ offset: 4 }}
        validateStatus={meta.error ? 'error' : 'success'}
        help={meta.error && meta.error}
      >
        {fields.map((member, index) => {
          return (
            <Row key={index} className={styles.denoRow}>
              <Col sm={4}>
                <Field
                  name={`${member}.money`}
                  component={AInputNumber}
                  parse={parseNumber}
                  placeholder="面额"
                  precision={0}
                  min={0}
                  style={{ width: '100%' }}
                  disabled={disabled}
                />
              </Col>
              <Col sm={4} offset={1}>
                <Field
                  name={`${member}.min_count`}
                  component={AInputNumber}
                  parse={parseNumber}
                  precision={0}
                  min={0}
                  placeholder="最小数量"
                  style={{ width: '100%' }}
                  disabled={disabled}
                />
              </Col>
              <Col sm={4} offset={1}>
                <Field
                  name={`${member}.max_count`}
                  placeholder="最大数量"
                  parse={parseNumber}
                  precision={0}
                  min={0}
                  component={AInputNumber}
                  style={{ width: '100%' }}
                  disabled={disabled}
                />
              </Col>
              {!disabled && (
                <Popconfirm
                  title="您确认要删除吗?"
                  onConfirm={() => fields.remove(index)}
                  placement="topLeft"
                  okText="是"
                  cancelText="否"
                >
                  <Icon className={styles.deleteDenoIcon} type="minus-circle-o" />
                </Popconfirm>
              )}
            </Row>
          );
        })}
        <Button
          type="dashed"
          style={{ width: '40%', marginLeft: '8%', marginTop: '10px' }}
          onClick={() => fields.push({ money: '', min_count: '', max_count: '' })}
          disabled={disabled}
        >
          <Icon type="plus" /> 添加面额
        </Button>
      </FormItem>
    );
  };

  handleCancel = () => {
    this.props.reset();
    this.props.onCancel && this.props.onCancel();
  };

  handleChangeType = e => {
    // let type = e.target.value;
    // if(type === 1) {
    //   this.props.change('condition1', [{}])
    // }else {
    //   this.props.change('condition2', {})
    // }
  };

  render() {
    const {
      editing,
      handleSubmit,
      pristine,
      reset,
      action,
      submitting,
      terms = [],
      condition_type,
      condition2 = {},
      onEdit,
      cardList,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const req = value => (value || typeof value === 'number' ? undefined : 'Required');

    return (
      <Form onSubmit={handleSubmit(this.save)}>
        <Field
          label="类型"
          name="card_type"
          component={ASelect}
          {...formItemLayout}
          style={{ width: 200 }}
          placeholder="请选择类型"
          disabled={!editing}
        >
          {map(cardList, card => {
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
          parse={parseNumber}
          component={AInputNumber}
          {...formItemLayout}
          style={{ width: 200 }}
          disabled={!editing}
          precision={2}
          min={0}
        />
        <Field
          label="倍数"
          name="multiple"
          component={AInputNumber}
          {...formItemLayout}
          style={{ width: 200 }}
          parse={parseNumber}
          precision={0}
          min={0}
          disabled={!editing}
          placeholder=""
        />
        <Field
          label="条件"
          name="condition_type"
          component={ARadioGroup}
          {...formItemLayout}
          onChange={this.handleChangeType}
          disabled={!editing}
          placeholder=""
        >
          <Radio.Button value={1}>指定面额</Radio.Button>
          <Radio.Button value={2}>面额区间</Radio.Button>
        </Field>

        {condition_type === 1 ? (
          <FieldArray
            name="condition1"
            disabled={!editing}
            {...formItemLayout}
            component={this.renderItem}
          />
        ) : (
          <Row>
            <Col sm={4} offset={4}>
              <Field
                name="condition2.min_money"
                parse={parseNumber}
                precision={0}
                min={0}
                component={AInputNumber}
                style={{ width: '100%' }}
                disabled={!editing}
                placeholder="最小面额"
              />
            </Col>
            <Col sm={1} style={{ textAlign: 'center', marginTop: '8px' }}>
              ~
            </Col>
            <Col sm={4}>
              <Field
                name="condition2.max_money"
                parse={parseNumber}
                precision={0}
                min={0}
                component={AInputNumber}
                style={{ width: '100%' }}
                disabled={!editing}
                placeholder="最大面额"
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
          disabled={!editing}
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
          disabled={!editing}
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
          disabled={!editing}
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
          disabled={!editing}
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
          style={{ width: 200 }}
          parse={parseNumber}
          min={0}
          precision={0}
          {...formItemLayout}
          placeholder="不填代表不限制"
          disabled={!editing}
        />

        {!editing ? (
          <Form.Item>
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>
            <Button key="edit" type="primary" className={styles.submit} onClick={onEdit}>
              编辑
            </Button>
          </Form.Item>
        ) : (
          <Form.Item>
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>
            <Button type="primary" className={styles.submit} htmlType="submit">
              保存
            </Button>
          </Form.Item>
        )}
      </Form>
    );
  }
}
