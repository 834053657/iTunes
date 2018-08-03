import React, { PureComponent, Component, Fragment } from 'react';
import { Form, Button, Row, Col, Icon, Radio, Modal, InputNumber } from 'antd';
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

const CardType = filter(CONFIG.card_type, item => item.valid);
export default class CardsMsgForm extends PureComponent {
  renderItem = arg => {
    console.log(arg);
    const { fields, formitemlayout, meta, _error, disabled } = arg;
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
              <Col sm={3} offset={1}>
                <Button icon="close-circle-o" onClick={() => fields.remove(index)}>
                  删除
                </Button>
              </Col>
            </Row>
          );
        })}
      </FormItem>
    );
  };

  render() {
    const {
      editing = false,
      handleSubmit,
      pristine,
      reset,
      submitting,
      terms = [],
      psw,
      condition2 = {},
      onEdit,
    } = this.props;

    console.log(this.props);
    console.log(psw);
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
      <div>
        <FieldArray
          name="items"
          disabled={!editing}
          {...formItemLayout}
          component={this.renderItem}
        />
      </div>
    );
  }
}
