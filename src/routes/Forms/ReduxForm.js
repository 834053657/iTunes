import React, { PureComponent, Component, Fragment } from 'react';
import { Form, Button, Row, Col, Icon } from 'antd';
// import AsyncValidator from 'async-validator'
import { map } from 'lodash';
import { connect } from 'dva';
import {
  Field,
  reduxForm,
  formValueSelector,
  getFormValues,
  FieldArray,
  SubmissionError,
} from 'redux-form';
import { validate } from '../../utils/utils';
import { AInput, ASelect, AOption, AInputNumber } from './createField';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

const descriptor = {
  unit_price: {
    required: true,
    message: '必填',
  },
  cards: {
    type: 'array',
    required: true,
    message: { _error: '错误' },
    defaultField: {
      type: 'object',
      fields: {
        min: { required: true, message: '必填' },
        price: { required: true, message: '必填' },
        subCards: {
          type: 'array',
          defaultField: {
            type: 'object',
            fields: {
              a: { required: true, message: 'a 必填' },
            },
          },
        },
      },
    },
  },
};
// 根据校验规则构造一个 validator
// const validator = new AsyncValidator(descriptor)

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
  // validate: (values, props) => {
  //   return validate(descriptor, values);
  //   // if (!['john', 'paul', 'george', 'ringo'].includes(values.unit_price)) {
  //   //     return { unit_price: 'User does not exist' };
  //   //   }
  // },
})
export default class ReduxForm extends PureComponent {
  save = values => {
    // console.log(values);
    // // throw new SubmissionError({"unit_price": '错误1'});
    // throw new SubmissionError({cards: [{},{'price': 'sb13'}]});

    // console.log(values);
    const err = validate(descriptor, values);
    if (err) {
      throw new SubmissionError(err);
    }
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
  renderSubItem = ({ fields, formitemlayout, meta: { touched, error } }) => {
    console.log(fields);
    return (
      <Fragment>
        <div>
          <button type="button" onClick={() => fields.push({ a: 0, b: 0 })}>
            添加 subCards
          </button>
          {touched && error && <span>{error}</span>}
        </div>
        {fields.map((member, index) => {
          return (
            <Row key={index}>
              <Col sm={8}>
                <Field name={`${member}.a`} component={AInputNumber} />
              </Col>
              <Col sm={8}>
                <Field name={`${member}.b`} component={AInputNumber} />
              </Col>
              <Col sm={4}>
                <Button icon="close-circle-o" onClick={() => fields.remove(index)}>
                  删除
                </Button>
                <h4>subCards #{index + 1}</h4>
              </Col>
            </Row>
          );
        })}
      </Fragment>
    );
  };

  renderItem = arg => {
    const { fields, formitemlayout, meta, _error } = arg;
    console.log(fields);
    return (
      <FormItem validateStatus={meta.error ? 'error' : 'success'} help={meta.error && meta.error}>
        <div>
          <button type="button" onClick={() => fields.push({ priwce: '', min: '', max: '' })}>
            添加 cards
          </button>
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
                <Field name={`${member}.priwce`} component={AInputNumber} />
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
  };

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    console.log(this.props);

    return (
      <PageHeaderLayout title="高级表单" content="高级表单常见于一次性输入和提交大批量数据的场景。">
        <Form style={{ width: 1000 }} onSubmit={handleSubmit(this.save)}>
          {/*   <Field
            label="类型"
            name="type"
            component={ASelect}
            {...formItemLayout}
            placeholder="请选择类型"
          >
            <AOption key={1} value={1}>
              美卡
            </AOption>
          </Field>*/}
          <Field
            label="单价"
            name="unit_price"
            component={AInput}
            {...formItemLayout}
            placeholder=""
          />
          {/*   <Field
            label="倍数"
            name="multiple"
            component={AInput}
            {...formItemLayout}
            placeholder=""
          />*/}
          <FieldArray name="cards" {...formItemLayout} component={this.renderItem} />

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </PageHeaderLayout>
    );
  }
}
