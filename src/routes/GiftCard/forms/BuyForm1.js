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
import { map, mapKeys, cloneDeep, filter, head, mapValues } from 'lodash';
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
  mapPropsToFields: props => {
    console.log(props.initialValues);
    return Object.keys(props.initialValues).reduce((acc, cv) => {
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
  state = {
    termModalInfo: false,
    formNumber: [],
    conditionFix: [
      {
        money: '',
        min_count: '',
        max_count: '',
      },
    ],
    conditionRange: { min_money: '', max_money: '' },
  };
  postData = [];
  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    const { form, defaultValue } = this.props;
    const { condition, conditionType, conditionFix, conditionRange } = this.state;
    e.preventDefault();

    //const a = form.getFieldValue('condition');
    const requireArr = [
      'card_type',
      'unit_price',
      'multiple',
      'condition_type',
      'password_type',
      'deadline',
      'guarantee_time',
      'term_id',
      'concurrency_order',
      'condition',
    ];
    let a = null;
    if (conditionType === 1 || defaultValue.condition_type === 1) {
      a = conditionFix;
    }
    if (conditionType === 2 || defaultValue.condition_type === 2) {
      a = conditionRange;
    }

    this.props.form.validateFieldsAndScroll(requireArr, (err, values) => {
      if (Array.isArray(values.condition)) {
        values.condition.map(c => {
          c.money = +c.money;
          c.min_count = +c.min_count;
          c.max_count = +c.max_count;
          return c;
        });
      } else {
        values.condition.min_money = +values.condition.min_money;
        values.condition.max_money = +values.condition.max_money;
      }

      if (!err) {
        this.props.onSubmit({
          ...values,
          //condition: [{money: '1', min_count: '5', max_count: '33'}],
          password_type: +values.password_type,
        });
      }
    });
  };

  handleShowTerm = () => {
    const { form } = this.props;
    const term_id = form.getFieldValue('term_id');
    this.setState({
      termModalInfo: true,
    });
  };

  handleHideTermModal = () => {
    this.setState({
      termModalInfo: false,
    });
  };

  remove = i => {
    const { form } = this.props;
    const { conditionFix } = this.state;
    const { action, defaultValue } = this.props;

    const data = action ? defaultValue.condition : conditionFix;

    data.splice(i, 1);
    this.setState({
      conditionFix: data,
    });
    this.props.form.setFieldsValue({
      'condition[]': data,
    });
  };

  add = () => {
    const { form } = this.props;
    this.postData.push(dataItem);
    form.setFieldsValue({
      condition: this.postData,
    });
    const condition = form.getFieldValue('condition');
  };

  addTest = () => {
    const { action, defaultValue } = this.props;
    const { conditionFix } = this.state;

    const formDataObj = {
      money: 0,
      min_count: 0,
      max_count: 0,
    };
    const condition = action ? defaultValue.condition : conditionFix;
    condition.push(formDataObj);

    this.setState({
      condition,
    });
    this.props.form.setFieldsValue({
      'condition[]': condition,
    });
  };

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields },
    }));
  };

  changeConditionType = e => {
    const { condition } = this.state;
    this.setState({
      conditionType: e.target.value,
    });
  };

  changeFixedMoney = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionFix } = this.state;
    const data = action ? defaultValue.condition : conditionFix;
    console.log(typeof e);
    data[index].money = e;

    this.setState({
      conditionFix: data,
    });
    this.props.form.setFieldsValue({
      'conditionFix[]': data,
    });
  };

  changeFixMin = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionFix } = this.state;
    const data = action ? defaultValue.condition : conditionFix;

    data[index].min_count = +e;
    this.setState({
      conditionFix: data,
    });
    this.props.form.setFieldsValue({
      'conditionFix[]': data,
    });
  };

  changeFixMax = (e, index) => {
    console.log('fixmax', e);
    const { action, defaultValue } = this.props;
    const { conditionFix } = this.state;
    const data = action ? defaultValue.condition : conditionFix;

    data[index].max_count = +e;
    this.setState({
      conditionFix: data,
    });
    this.props.form.setFieldsValue({
      'conditionFix[]': data,
    });
  };

  rangeMax = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionRange } = this.state;
    const data = action ? defaultValue.condition : conditionRange;

    data.max_money = e;
    this.setState({
      conditionRange: data,
    });
    this.props.form.setFieldsValue({
      'conditionRange{}': data,
    });
  };

  rangeMin = (e, index) => {
    const { action, defaultValue } = this.props;
    const { conditionRange } = this.state;
    const data = action ? defaultValue.condition : conditionRange;

    data.min_money = e;
    this.setState({
      conditionRange: data,
    });
    this.props.form.setFieldsValue({
      'conditionRange{}': data,
    });
  };

  render() {
    const { termModalInfo, conditionFix, conditionRange, conditionType } = this.state;
    const {
      defaultValue,
      action,
      terms = [],
      form: { getFieldDecorator, getFieldValue, resetForm },
    } = this.props;

    const { condition: deCo = [] } = defaultValue;

    const initialValues = {
      card_type:
        CONFIG.card_type &&
        CONFIG.card_type.filter(c => c.valid)[0] &&
        CONFIG.card_type.filter(c => c.valid)[0].type,
      //card_type: CONFIG.card_type.filter(c => c.valid)[0].type,
      unit_price: 10,
      multiple: 1,
      condition_type: 1,
      condition: [],
      password_type: 1,
      deadline: CONFIG.deadline && head(CONFIG.deadline),
      guarantee_time: CONFIG.guarantee_time && head(CONFIG.guarantee_time),
      term_id: 0,
      concurrency_order: 0, //并发订单数，传0代表不限制
    };

    const conditionTypeList = initialValues.condition_type === 1 ? conditionFix : conditionRange;

    const conditionList = action ? deCo : conditionTypeList;

    const cardList = mapKeys(CONFIG.card_type || [], item => item.type);

    // getFieldDecorator('conditionFix[]', { initialValue: conditionList });
    // getFieldDecorator('conditionRange{}', { initialValue: conditionList });

    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const formItemLayoutDeno = {
      wrapperCol: {
        xs: { span: 14, offset: 0 },
        sm: { span: 14, offset: 4 },
      },
    };
    const formItemLayoutBtn = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    console.log(this.props);

    return (
      <Form className={styles.form} onSubmit={this.handleSubmit}>
        {conditionList.map((k, index) => {
          return (
            <Row key={index} className={styles.fixed}>
              <Col className={styles.fixedNum}>
                <FormItem required={false}>
                  {getFieldDecorator(`condition[${index}].money`, {
                    initialValue: action ? k.money : '',
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        message: '请输入面额',
                      },
                    ],
                  })(
                    <InputNumber
                      disabled={action && action !== 'edit'}
                      onChange={e => this.changeFixedMoney(e, index)}
                      placeholder="面额"
                    />
                  )}
                </FormItem>
              </Col>
              <Col className={styles.fixedMin}>
                <FormItem required={false}>
                  {getFieldDecorator(`condition[${index}].min_count`, {
                    initialValue: action ? k.min_count : '',
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        message: '请输入最小数量',
                      },
                    ],
                  })(
                    <InputNumber
                      disabled={action && action !== 'edit'}
                      onChange={e => this.changeFixMin(e, index)}
                      placeholder="最小数量"
                    />
                  )}
                </FormItem>
              </Col>
              <Col className={styles.fixedMax}>
                <FormItem required={false}>
                  {getFieldDecorator(`condition[${index}].max_count`, {
                    initialValue: action ? k.max_count : '',
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        message: '请输入最大数量',
                      },
                    ],
                  })(
                    <InputNumber
                      disabled={action && action !== 'edit'}
                      onChange={e => this.changeFixMax(e, index)}
                      placeholder="最大数量"
                    />
                  )}
                </FormItem>
                {!action ||
                  (action === 'edit' && (
                    <Icon
                      className="dynamic-delete-button"
                      type="minus-circle-o"
                      disabled={conditionList.length === 1}
                      onClick={() => this.remove(index)}
                    />
                  ))}
              </Col>
            </Row>
          );
        })}

        <Button
          disabled={action && action !== 'edit'}
          type="dashed"
          onClick={this.addTest}
          style={{ width: '60%' }}
        >
          <Icon type="plus" /> 添加面额
        </Button>

        <Button className={styles.submit} type="primary" htmlType="submit">
          发布
        </Button>
      </Form>
    );
  }
}
