import React, {PureComponent, Component, Fragment} from 'react';
import {Form, Button, Row, Col, Icon, Radio, Popconfirm, Popover, message} from 'antd';
import {FormattedMessage as FM, defineMessages} from 'react-intl';
// import AsyncValidator from 'async-validator'
import {map, filter, omit, forEach, size} from 'lodash';
import {connect} from 'dva';
import {
  Field,
  reduxForm,
  formValueSelector,
  getFormValues,
  FieldArray,
  SubmissionError,
  FormSection,
} from 'redux-form';
import {injectIntl} from 'components/_utils/decorator';
import {validate, parseNumber, createError} from '../../../utils/utils';
import {
  AInput,
  ASelect,
  AOption,
  AInputNumber,
  ARadioGroup,
  ASwitch,
} from '../../../components/_utils/createField';
import styles from './SellForm.less';

const FormItem = Form.Item;

const msg = defineMessages({
  account_money: {
    id: 'BuyForm.account_money',
    defaultMessage: '面额'
  },
  account_max_num: {
    id: 'BuyForm.account_max_num',
    defaultMessage: '最大数量'
  },
  choose_type: {
    id: 'BuyForm.choose_type',
    defaultMessage: '请选择类型'
  },
  multiple: {
    id: 'BuyForm.multiple',
    defaultMessage: '倍数(选填)'
  },
  min_account: {
    id: 'BuyForm.min_account',
    defaultMessage: '最小面额'
  },
  max_account: {
    id: 'BuyForm.max_account',
    defaultMessage: '最大面额'
  },

  min_totalMoney: {
    id: 'BuyForm.min_totalMoney',
    defaultMessage: '最小总面额'
  },
  max_totalMoney: {
    id: 'BuyForm.max_totalMoney',
    defaultMessage: '最大总面额'
  },
  choose_send_card_time: {
    id: 'BuyForm.choose_send_card_time',
    defaultMessage: '请选择发卡期限'
  },
  choose_safe_time: {
    id: 'BuyForm.choose_safe_time',
    defaultMessage: '请选择保障时间'
  },
  deal_rules_choose: {
    id: 'BuyForm.deal_rules_choose',
    defaultMessage: '请选择交易条款'
  },
  no_limit: {
    id: 'BuyForm.no_limit',
    defaultMessage: '不填代表不限制'
  },

  check: {
    id: 'BuyForm.check',
    defaultMessage: '查看'
  },
});

// 根据校验规则构造一个 validator
// const validator = new AsyncValidator(descriptor)

@injectIntl()
@connect(state => {
  return {
    fluid: formValueSelector('loginForm')(state, 'fluid'),
    total_money: formValueSelector('loginForm')(state, 'total_money') || {},
    condition_type: formValueSelector('loginForm')(state, 'condition_type'),
    condition2: formValueSelector('loginForm')(state, 'condition2') || {},
    condition1: formValueSelector('loginForm')(state, 'condition1') || [],
  };
})
@reduxForm({
  form: 'loginForm', // a unique name for this form
})
export default class BuyForm extends PureComponent {
  descriptor = {
    card_type: {
      required: true,
      message: <FM id='BuyForm.type_choose' defaultMessage='请选择类型'/>,
    },
    unit_price: {
      required: true,
      type: 'number',
      message: <FM id='BuyForm.input_number' defaultMessage='请输入单价'/>,
    },
    condition_type: {
      required: true,
      message: <FM id='BuyForm.choose_type_' defaultMessage='请选择条件类型'/>,
    },
    condition1: {
      type: 'array',
      required: true,
      message: {_error: <FM id='BuyForm.error_add_assign' defaultMessage='请添加指定面额'/>},
      defaultField: {
        type: 'object',
        fields: {
          money: [
            {
              required: true,
              type: 'number',
              message: <FM id='BuyForm.input_account_money' defaultMessage='请输入面额'/>,
            },
          ],
          max_count: {
            required: true,
            type: 'number',
            message: <FM id='BuyForm.input_max_num' defaultMessage='请输入最大数量'/>
          },
        },
      },
    },
    condition2: {
      type: 'object',
      required: true,
      message: {_error: <FM id='BuyForm.condition2_input_' defaultMessage='请填写'/>},
      fields: {
        multiple: [
          {
            required: false,
            type: 'number',
            message: <FM id='BuyForm.input_multiple' defaultMessage='请输入倍数'/>,
          },
          {
            pattern: /^[1-9]\d*$/,
            message: <FM id='BuyForm.integer_input' defaultMessage='请输入正整数'/>,
          },
        ],
        min_money: [
          {
            required: true,
            type: 'number',
            message: <FM id='BuyForm.input_min_account' defaultMessage='请输入最小面额'/>,
          },
          {
            pattern: /^[1-9]\d*$/,
            message: <FM id='BuyForm.input_' defaultMessage='请输入正整数'/>,
          },
        ],
        max_money: [
          {
            required: true,
            type: 'number',
            message: <FM id='BuyForm.input_max_amount' defaultMessage='请输入最大面额'/>,
          },
          {
            pattern: /^[1-9]\d*$/,
            message: <FM id='BuyForm.condition2_input_integer' defaultMessage='请输入正整数'/>,
          },
        ],
      },
    },
    deadline: {
      required: true,
      message: <FM id='BuyForm.deadline_time_choose' defaultMessage='请选择发卡期限'/>,
    },
    guarantee_time: {
      required: true,
      message: <FM id='BuyForm.guarantee_time' defaultMessage='请选择保障时间'/>,
    },
    password_type: {
      required: true,
      message: <FM id='BuyForm.password_type' defaultMessage='请输入选择密保卡类型'/>,
    },
  };

  save = values => {
    const {condition_type, fluid} = this.props;
    const rules = omit(this.descriptor, condition_type === 1 ? 'condition2' : 'condition1');
    values.unit_price = parseFloat(values.unit_price)
    const {total_money: {min, max}} = values

    const err = validate(rules, values);
    const checkErr = {};
    if (values.unit_price <= 0) {
      createError(checkErr, `unit_price`,
        <FM
          id='BuyForm.unit_price.limit'
          defaultMessage='单价必须大于0'
        />
      );
    }
    if (err) {
      throw new SubmissionError(err);
    }
    this.setState({
      renderAfterSave: true
    })

    if (max < min) {
      createError(checkErr, `total_money.min`,
        <FM
          id='BuyForm.total_money.min.limit'
          defaultMessage='该数值应小于最大总面额'
        />
      )
    }

    //购买广告
    if (condition_type === 1) {
      //验证最小总面额小于最大总面额
      //验证已添加指定面额
      if (values.condition1.length < 1) {
        createError(checkErr, `condition_type`,
          <FM
            id='BuyForm.condition_type.limit'
            defaultMessage='未添加指定面额'
          />
        )
      }
      //验证总面额
      if (fluid && this.fluidLastMoney() < 0) {
        createError(checkErr, `condition1.${values.condition1.length - 1}.max_count`,
          <FM
            id='BuyForm.condition1.max_deno.limit'
            defaultMessage='总面额值超过流动最大值'
          />
        )
      }
      //验证非流动性单个面额数量
      if (!fluid) {
        forEach(values.condition1, (value, key) => {
          if (value.money * value.max_count > values.total_money.max) {
            createError(checkErr, `condition1.${key}.max_count`,
              <FM
                id='BuyForm.condition1.max_count.noFluid.limit'
                defaultMessage='对应面额乘以数量不得大于总面额'
              />
            );
          }
        });
      }
      //验证流动性
      forEach(values.condition1, (value, key) => {
        if (value.money > values.total_money.max) {
          createError(checkErr, `condition1.${key}.money`,
            <FM
              id='BuyForm.condition1.max_count.limit'
              defaultMessage='该数值应小于最大总面额'
            />
          );
        }
      });
      values.condition = values.condition1;
      if (fluid) {
        values.fluid = 1
      } else {
        values.fluid = 0
      }
    }
    else {
      if (values.condition2.max_money > values.total_money.max) {
        createError(checkErr, `condition2.max_money`,
          <FM
            id='BuyForm.condition2.max_money.limit'
            defaultMessage='该数值应小于最大总面额'
          />
        );
      }
      if (values.condition2.multiple > values.total_money.max) {
        createError(checkErr, `condition2.multiple`,
          <FM
            id='BuyForm.condition2.multiple.limit'
            defaultMessage='该数值应小于最大总面额'
          />
        );
      }
      if (!values.condition2.multiple) {
        values.condition2.multiple = 1
      }
      if (values.condition2.min_money > values.condition2.max_money) {
        createError(checkErr, `condition2.min_money`,
          <FM
            id='BuyForm.num_lessThan_right'
            defaultMessage='该数值应小于右侧值'
          />);
      }
      values.condition = values.condition2;
    }

    if (size(checkErr) > 0) {
      throw new SubmissionError(checkErr);
    }
    const params = omit(values, ['condition2', 'condition1']);
    this.props.onSubmit(params);
  };
  fluid = false;
  renderItem = arg => {
    const {intl, total_money, fluid, condition1} = this.props;
    const {fields, formitemlayout, meta, _error, disabled, editing} = arg;
    return (
      <FormItem
        wrapperCol={{offset: 4}}
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
                  placeholder={intl.formatMessage(msg.account_money)}
                  precision={0}
                  min={0}
                  style={{width: '100%'}}
                  disabled={disabled}
                />
              </Col>
              <Col sm={4} offset={1}>
                <Field
                  name={`${member}.max_count`}
                  placeholder={intl.formatMessage(msg.account_max_num)}
                  parse={parseNumber}
                  precision={0}
                  min={0}
                  component={AInputNumber}
                  style={{width: '100%'}}
                  disabled={disabled}
                />
              </Col>
              {!disabled && (
                <Popconfirm
                  title={<FM id='BuyForm.sure_to_cancel' defaultMessage='您确认要删除吗?'/>}
                  onConfirm={() => fields.remove(index)}
                  placement="topLeft"
                  okText={<FM id='BuyForm.choose_ok' defaultMessage='是'/>}
                  cancelText={<FM id='BuyForm.choose_no' defaultMessage='否'/>}
                >
                  <Icon className={styles.deleteDenoIcon} type="minus-circle-o"/>
                </Popconfirm>
              )}
            </Row>
          );
        })}
        <Button
          type="dashed"
          style={{width: '40%', marginTop: '30px'}}
          onClick={() => {
            let money = total_money.max
            let noBlank = true
            if (fluid) {
              condition1.map(item => {
                const ArrayMoney = item.money * item.max_count
                if (!ArrayMoney) {
                  noBlank = false
                }
                return money -= ArrayMoney
              })
            }
            if (total_money.max) {
              if ((money > 0 && fluid) || !fluid) {
                if (noBlank) {
                  fields.push({money: '', max_count: ''})
                } else {
                  message.warning(PROMPT('BuyForm.lack.info'));
                  // message.warning('请填写完整面额信息')
                }
              } else {
                message.warning(PROMPT('BuyForm.fluid.beyondTop'));
                // message.warning('流动最大值已达上限')
              }
            } else {
              message.warning(PROMPT('BuyForm.lack.total_money'));
              // message.warning('请先填写总面额')
            }
          }}
          disabled={disabled}
        >
          <Icon type="plus"/> <FM id='BuyForm.add_account' defaultMessage='添加面额'/>
        </Button>
      </FormItem>
    );
  };

  fluidLastMoney = () => {
    const {total_money, fluid, condition1} = this.props
    let money = total_money.max
    if (fluid) {
      condition1.map(item => {
        const ArrayMoney = item.money * item.max_count
        return money -= ArrayMoney
      })
    }
    return money
  }

  handleCancel = () => {
    this.props.reset();
    this.props.onCancel && this.props.onCancel();
  };

  parseFloatNumber = (value, name) => {
    let v = value
    if (!isNaN(v)) {
      if (v.toString().split('.')[1] && v.toString().split('.')[1].length >= 2) {
        v = parseFloat(v)
        v = v.toFixed(2)
      }
    } else {
      v = 0
    }
    return v
  }

  previewTerms = () => {
    const win = window.open(`#/ad/terms`, '_blank');
    win.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fluid !== nextProps.fluid) {
      this.fluid = nextProps.fluid
    }
  }

  changeDynamic = () => {
    this.props.array.removeAll('condition1');
  }

  render() {
    const {
      intl,
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
      initialValues,
      fluid,
      total_money,
    } = this.props;
    if (action && !condition_type) {
      return false
    }
    const formItemLayout = {
      labelCol: {
        sm: {span: 4},
      },
      wrapperCol: {
        sm: {span: 16},
      },
    };
    const req = value => (value || typeof value === 'number' ? undefined : 'Required');
    const status = action === 'preview' && initialValues ? initialValues.status : undefined
    const showEdit = status && (status === 1 || status === 2)
    const DynamicInstruction = (
      <p style={{width: 300}}>
        <FM
          id='BuyForm.Fluid.describe'
          defaultMessage='
            流动性代表一个广告成交的订单具有上限值，上限值为最大总面额乘以单价。
        例如：收购最大总面额为 100 面额，
        卖家出售 20面额 的卡，流动性减至 80 面额乘以单价。
        如果交易未完成，流动性上限值恢复至 100 面额乘以单价；
        简单的说，开启流动性收卡有上限值，不开启流动性可以无限收卡'
        />
      </p>
    )
    const DynamicPop =
      (
        <Popover placement="right" content={DynamicInstruction}>
          <Icon style={{marginLeft: 10, fontSize: 16}} type="question-circle-o"/>
        </Popover>
      )
    return (
      <Form onSubmit={handleSubmit(this.save)}>
        <Field
          label={<FM id='BuyForm.card_type' defaultMessage='类型'/>}
          name="card_type"
          component={ASelect}
          {...formItemLayout}
          style={{width: 200}}
          placeholder={intl.formatMessage(msg.choose_type)}
          disabled={!editing || action === 'edit'}
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
          label={<FM id='BuyForm.unit_price' defaultMessage='单价'/>}
          name="unit_price"
          parse={this.parseFloatNumber}
          component={AInputNumber}
          {...formItemLayout}
          style={{width: 200}}
          disabled={!editing}
          addonAfter="RMB"
          precision={2}
          min={0}
        />

        {/*<Field
          label={<FM id='BuyForm.multiple_title' defaultMessage='倍数'/>}
          name="multiple"
          component={AInputNumber}
          {...formItemLayout}
          style={{width: 200}}
          parse={parseNumber}
          precision={0}
          min={0}
          disabled={!editing}
          placeholder=""
        />*/}

        <Row>
          <Col sm={12} offset={2}>
            <Field
              name="total_money.min"
              label={<FM id='BuyForm.total_money' defaultMessage='总面额'/>}
              parse={parseNumber}
              precision={0}
              min={0}
              {...formItemLayout}
              component={AInputNumber}
              style={{width: 110}}
              disabled={!editing}
              placeholder={intl.formatMessage(msg.min_totalMoney)}
            />
          </Col>
          <Col sm={1} style={{marginLeft: '-298px',marginTop:'5px'}}>~</Col>
          <Col sm={4}>
            <Field
              name="total_money.max"
              parse={parseNumber}
              precision={0}
              min={0}
              {...formItemLayout}
              component={AInputNumber}
              style={{width: 110, marginLeft: '-260%'}}
              disabled={!editing}
              placeholder={intl.formatMessage(msg.max_totalMoney)}
            />
          </Col>
        </Row>

        <Row>
          <Field
            name="fluid"
            label={<FM id='BuyForm.fluid' defaultMessage='流动性'/>}
            precision={0}
            {...formItemLayout}
            defaultChecked={fluid === 1}
            extranode={DynamicPop}
            component={ASwitch}
            disabled={!!action}
            onChange={this.changeDynamic}
          />
        </Row>

        <Field
          label={<FM id='BuyForm.condition_type' defaultMessage='条件'/>}
          name="condition_type"
          component={ARadioGroup}
          {...formItemLayout}
          disabled={!editing}
          placeholder=""
        >
          <Radio.Button value={1}><FM id='BuyForm.btn_account' defaultMessage='指定面额'/></Radio.Button>
          <Radio.Button value={2}><FM id='BuyForm.btn_account_region' defaultMessage='面额区间'/></Radio.Button>
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
            <Col sm={3} offset={4}>
              <Field
                name="condition2.multiple"
                parse={parseNumber}
                precision={0}
                min={0}
                style={{width: '100%'}}
                component={AInputNumber}
                disabled={!editing || !total_money.max}
                placeholder={intl.formatMessage(msg.multiple)}
              />
            </Col>
            <Col sm={3} offset={1}>
              <Field
                name="condition2.min_money"
                parse={parseNumber}
                precision={0}
                min={0}
                component={AInputNumber}
                style={{width: '100%'}}
                disabled={!editing || !total_money.max}
                placeholder={intl.formatMessage(msg.min_account)}
              />
            </Col>
            <Col sm={1} style={{textAlign: 'center', marginTop: '5px'}}>
              ~
            </Col>
            <Col sm={3}>
              <Field
                name="condition2.max_money"
                parse={parseNumber}
                precision={0}
                min={0}
                component={AInputNumber}
                style={{width: '100%'}}
                disabled={!editing || !total_money.max}
                placeholder={intl.formatMessage(msg.max_account)}
              />
            </Col>
          </Row>
        )}

        <Field
          label={<FM id='BuyForm.ask_title' defaultMessage='要求'/>}
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
          label={<FM id='BuyForm.time_send_card' defaultMessage='发卡期限'/>}
          name="deadline"
          component={ASelect}
          {...formItemLayout}
          placeholder={intl.formatMessage(msg.choose_send_card_time)}
          style={{width: 200}}
          disabled={!editing}
        >
          {map(CONFIG.deadline, (item, index) => (
            <AOption key={item} value={item}>
              {item}<FM id='BuyForm.minute_time' defaultMessage='分钟'/>
            </AOption>
          ))}
        </Field>

        <Field
          label={<FM id='BuyForm.safe_time' defaultMessage='保障时间'/>}
          name="guarantee_time"
          component={ASelect}
          {...formItemLayout}
          placeholder={intl.formatMessage(msg.choose_safe_time)}
          style={{width: 200}}
          disabled={!editing}
        >
          {map(CONFIG.guarantee_time, (item, index) => (
            <AOption key={item} value={item}>
              {item}<FM id='BuyForm.safe_time_minute' defaultMessage='分钟'/>
            </AOption>
          ))}
        </Field>

        <Field
          label={
            <span>
              <FM id='BuyForm.deal_rules' defaultMessage='交易条款'/>
              <i>
                (<FM id='BuyForm.can_be_choose' defaultMessage='可选'/>)
              </i>
            </span>
          }
          name="term_id"
          component={ASelect}
          style={{width: 200}}
          {...formItemLayout}
          placeholder={intl.formatMessage(msg.deal_rules_choose)}
          disabled={!editing}
          extranode={
            <a onClick={this.previewTerms} style={{marginLeft: '10px'}}>
              {this.props.intl.formatMessage(msg.check)}
            </a>
          }
        >
          <AOption value={0}><FM id='BuyForm.none_' defaultMessage='无'/></AOption>
          {map(terms, (item, index) => (
            <AOption
              key={item.id}
              value={+item.id}
            >
              {item.title}
            </AOption>
          ))}
        </Field>

        <Field
          label={<FM id='BuyForm.order_num_' defaultMessage='同时处理订单数'/>}
          name="concurrency_order"
          component={AInputNumber}
          style={{width: 200}}
          parse={parseNumber}
          min={0}
          precision={0}
          {...formItemLayout}
          // placeholder={intl.formatMessage(msg.no_limit)}
          placeholder={PROMPT(msg.no_limit.id)}
          disabled={!editing}
        />
        <Form.Item className={styles.buttonBox}>
          <Button key="back" onClick={this.handleCancel}>
            <FM id='BuyForm.cancel_btn' defaultMessage='返回'/>
          </Button>
          {(!editing ?
              showEdit &&
              (
                <Button
                  key="edit"
                  type="primary"
                  className={styles.submit}
                  onClick={onEdit}
                >
                  <FM id='BuyForm.edit_btn' defaultMessage='编辑'/>
                </Button>
              )
              :
              (
                <Popconfirm
                  title={<FM id='BuyForm.sure_public' defaultMessage='确定发布吗？'/>}
                  onConfirm={handleSubmit(this.save)}
                  okText={<FM id='BuyForm.sure_public_yes' defaultMessage='是'/>}
                  cancelText={<FM id='BuyForm.sure_public_no' defaultMessage='否'/>}
                >
                  <Button
                    type="primary"
                    className={styles.submit}
                    htmlType="submit"
                    loading={this.props.submitSellForm}
                  >
                    <FM id='BuyForm.btn_keep' defaultMessage='发布'/>
                  </Button>
                </Popconfirm>
              )
          )}
        </Form.Item>
      </Form>
    );
  }
}
