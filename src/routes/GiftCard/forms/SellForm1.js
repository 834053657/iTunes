import React, {PureComponent, Component, Fragment} from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Icon,
  Radio,
  Modal,
  InputNumber,
  message,
  Popconfirm,
  Card,
  Input,
  Divider,
  Spin,
  Upload,
} from 'antd';
// import AsyncValidator from 'async-validator'
import {map, filter, omit, forEach, size, get} from 'lodash';
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
import {validate, parseNumber, createError, formatMoney} from '../../../utils/utils';
import DescriptionList from '../../../components/DescriptionList';
import {
  AInput,
  ASelect,
  AOption,
  AInputNumber,
  ARadioGroup,
  AUpload,
} from '../../../components/_utils/createField';
import styles from './SellForm.less';
import CardsMsgForm from './CardsMsgForm';
import {getAuthority} from '../../../utils/authority';

const FormItem = Form.Item;
const {Description} = DescriptionList;

// 根据校验规则构造一个 validator
// const validator = new AsyncValidator(descriptor)
@connect(state => {
  return {
    password_type: formValueSelector('sellForm')(state, 'password_type'),
    cards: formValueSelector('sellForm')(state, 'cards') || [],
    unit_price: formValueSelector('sellForm')(state, 'unit_price') || 0,
  };
})
@reduxForm({
  form: 'sellForm', // a unique name for this form
})
export default class ReduxForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addDenoVisible: false,
      uploading: false,
    };
  }

  descriptor = () => {
    return {
      card_type: {
        required: true,
        message: '请选择类型',
      },
      unit_price: {
        required: true,
        type: 'number',
        message: '请输入单价',
      },

      password_type: {
        required: true,
        message: '请选择条件类型',
      },
      cards: {
        type: 'array',
        required: true,
        message: {_error: '请添加面额'},
        defaultField: {
          type: 'object',
          fields: {
            items: [
              {
                required: true,
                type: 'array',
                message: '请添加密码信息',
                defaultField: {
                  type: 'object',
                  fields: {
                    password: [
                      {
                        required: this.props.password_type === 1 || this.props.password_type === 3,
                        type: 'string',
                        message: '请输入卡密',
                      },
                      {
                        min: 4,
                        message: '最小长度不得小于4位',
                      },
                      {
                        max: 50,
                        message: '最大长度不得超过50位',
                      },
                      {
                        pattern: /^[A-Za-z0-9]+$/,
                        message: '只能输入字母，数字组合',
                      },
                    ],
                    picture: [
                      {
                        required: this.props.password_type === 2 || this.props.password_type === 3,
                        type: 'string',
                        message: '请上传卡图',
                      },
                    ],
                  },
                },
              },
            ],
            money: [{required: true, type: 'number', message: '面额'}],
            receipt: {required: false, type: 'string', message: '凭证'},
          },
        },
      },
    };
  };

  save = values => {
    const {condition_type} = this.props;
    const rules = omit(this.descriptor());
    const err = validate(rules, values);
    const checkErr = {};
    if (err) {
      throw new SubmissionError(err);
    }

    if (size(checkErr) > 0) {
      throw new SubmissionError(checkErr);
    }
    const params = omit(values);

    this.props.onSubmit(params);
  };

  renderItem = arg => {
    const {fields, formitemlayout, meta, _error, disabled} = arg;
    return (
      <FormItem
        wrapperCol={{offset: 4}}
        validateStatus={meta.error ? 'error' : 'success'}
        help={meta.error && meta.error}
      >
        {fields.map((member, index) => {
          return (
            <Row key={index} style={{marginBottom: 20}}>
              <Col sm={4}>
                <Field
                  name={`${member}.money`}
                  component={AInputNumber}
                  parse={parseNumber}
                  placeholder="面额"
                  precision={0}
                  min={0}
                  style={{width: '100%'}}
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
                  style={{width: '100%'}}
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
                  style={{width: '100%'}}
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

  handleCancel = () => {
    this.props.reset();
    this.props.onCancel && this.props.onCancel();
  };

  handleChangeType = e => {
    this.props.array.removeAll('cards');
    this.setState({
      pswType: e,
    });
  };

  showAddMoneyBox = () => {
    this.setState({addDenoVisible: true});
  };

  handlerAddCard = () => {
    const {denoVaule} = this.state;
    const {cards} = this.props;
    const re = /^\+?[1-9][0-9]*$/;
    if (!re.test(denoVaule)) {
      return message.warning('请输入正整数格式');
    }
    const i = cards.findIndex(card => card.money === denoVaule);
    if (i >= 0) {
      return message.warning('该面额已存在');
    }
    const newItem = {
      money: denoVaule,
      receipt: '', // 凭证
      items: [
        {
          password: '', // 卡密
          picture: '', // 图片
        },
      ],
    };
    this.props.array.push('cards', newItem);
    this.setState({
      addDenoVisible: false,
    });
  };

  renderModal = fields => {
    const {denoVaule, addDenoVisible} = this.state;
    return (
      <Modal
        title="添加面额"
        width={400}
        destroyOnClose
        maskClosable={false}
        visible={addDenoVisible}
        onOk={this.handlerAddCard}
        onCancel={() => {
          this.setState({addDenoVisible: false});
        }}
      >
        <Row>
          <Col style={{width: 50, float: 'left', lineHeight: '30px'}}>面额:</Col>
          <Col style={{width: 150, float: 'left'}}>
            <Input
              style={{width: 150}}
              placeholder="请输入面额"
              onChange={e => {
                this.setState({denoVaule: +e.target.value});
              }}
              // onPressEnter={() => this.addDeno()}
            />
          </Col>
        </Row>
      </Modal>
    );
  };

  handlerUpload = (info, index, fieldName) => {
    if (info.file.status === 'uploading') {
      this.setState({
        uploading: true,
      });
    } else if (info.file.status === 'done') {
      const {array} = this.props;
      const newItems = get(info, 'file.response.data.items') || [];

      newItems.map(item => array.push(fieldName, item));
      this.setState({
        uploading: false,
      });
    } else if (info.file.status === 'error') {
      this.setState({uploading: false});
      message.error('上传错误，可能请求已过期，请刷新页面重试');
    }
  };

  renderCards = a => {
    const {fields, formitemlayout, meta, _error, disabled, pswType, action} = a;
    const {token, user} = getAuthority() || {};
    const {id} = user || {};
    const uploadProps = {
      name: 'file',
      action: `${CONFIG.base_url}/itunes/ad/cards/import`,
      showUploadList: false,
      headers: {
        'ITUNES-UID': id,
        'ITUNES-TOKEN': token,
      },
      data: file => {
        return {
          filename: file.name,
        };
      },
      beforeUpload(file) {
        const fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
        if (['csv', 'xls', 'xlsx'].indexOf(fileExt) < 0) {
          message.error('文件格式不对，您只能导入csv, xls或xlsx文件。');
          return false;
        }
        return true;
      },
    };

    return (
      <FormItem validateStatus={meta.error ? 'error' : 'success'} help={meta.error && meta.error}>
        {fields.map((fieldName, index, c) => {
          const cardItem = c.get(index);
          return (
            <Card
              style={{marginTop: '10px'}}
              key={index}
              title={
                <div>
                  <span>{cardItem.money}面额</span>
                  <span>({cardItem.items.length})</span>
                  <div style={{float: 'right'}}>
                    {pswType === 1 && !action && (
                      <Spin spinning={this.state.uploading}>
                        <Upload
                          onChange={info => this.handlerUpload(info, index, `${fieldName}.items`)}
                          {...uploadProps}
                        >
                          <Button>导入</Button>
                        </Upload>
                      </Spin>
                    )}
                  </div>
                  {pswType === 1 && !action && (
                    <a
                      style={{fontSize: 12, float: 'right', lineHeight: 3, marginRight: 10}}
                      href="../../../../public/PasswordTemplate.xlsx"
                      download="PasswordTemplate.xlsx"
                    >
                      点击下载模板
                    </a>
                  )}
                  {!disabled &&
                  fields.length !== 1 && (
                    <div style={{float: 'right'}}>
                      <Popconfirm
                        title="确定删除吗？"
                        onConfirm={() => this.props.array.remove('cards', index)}
                        okText="是"
                        cancelText="否"
                      >
                        <Icon className={styles.deleteIcon} type="minus-circle-o" />
                      </Popconfirm>
                    </div>
                  )}
                </div>
              }
              className={styles.card}
            >
              {/*凭证*/}
              {pswType !== 1 && (
                <div>
                  <Row>
                    <Col className={styles.pswTitle}>凭证:</Col>
                    <Col key={index} className={styles.pswInput}>
                      <Field
                        name={`${fieldName}.receipt`}
                        component={AUpload}
                        disabled={disabled || action === 'edit'}
                      />
                    </Col>
                  </Row>
                  <Divider style={{marginBottom: 32}} />
                </div>
              )}

              <FieldArray
                name={`${fieldName}.items`}
                {...formitemlayout}
                disabled={disabled}
                pswType={pswType}
                key={index}
                component={this.renderItems}
              />
            </Card>
          );
        })}
      </FormItem>
    );
  };

  renderItems = arg => {
    const {fields, formitemlayout, meta, _error, disabled, pswType} = arg;
    return (
      <div>
        {fields.map((fieldName, i, c) => {
          const status = c.get(i).status;
          return (
            <div key={i}>
              {pswType !== 2 && (
                <Row>
                  <Col className={styles.pswTitle}>卡密:</Col>
                  <Col className={styles.pswInput}>
                    <Field
                      name={`${fieldName}.password`}
                      component={AInput}
                      disabled={!!(disabled || status)}
                    />
                  </Col>
                  {!disabled &&
                  !status &&
                  fields.length !== 1 && (
                    <Col className={styles.deleteIcon}>
                      <Popconfirm
                        title="确定删除吗？"
                        onConfirm={() => fields.remove(i)}
                        okText="是"
                        cancelText="否"
                      >
                        <Icon type="minus-circle-o" />
                      </Popconfirm>
                    </Col>
                  )}
                </Row>
              )}

              {/*图片*/}
              {pswType !== 1 && (
                <Row>
                  <Col className={styles.pswTitle}>卡图:</Col>
                  <Col key={i} className={styles.pswInput}>
                    <Field
                      name={`${fieldName}.picture`}
                      component={AUpload}
                      disabled={!!(disabled || status)}
                    />
                  </Col>
                  {!disabled &&
                  !status &&
                  pswType === 2 && (
                    <Col className={styles.deleteIcon}>
                      <Popconfirm
                        title="确定删除吗？"
                        onConfirm={() => fields.remove(i)}
                        okText="是"
                        cancelText="否"
                      >
                        <Icon type="minus-circle-o" />
                      </Popconfirm>
                    </Col>
                  )}
                </Row>
              )}
            </div>
          );
        })}

        {
          this.props.editing && (
            <Button
              type="dashed"
              className={styles.addBtn}
              disabled={disabled}
              onClick={() => {
                fields.push({password: '', picture: ''});
              }}
            >
              <Icon type="plus" /> 添加卡密
            </Button>
          )
        }
      </div>
    );
  };

  calculateMoney = () => {
    const {cards} = this.props;
    let money = 0;
    let calculateMoney;
    // console.log(cards);
    calculateMoney = cards.map((item, index) => {
      calculateMoney = 0;
      return (calculateMoney += item.money * item.items.length);
    });
    calculateMoney.map(item => {
      return (money += item);
    });
    return money;
  };

  render() {
    const {
      editing = false,
      handleSubmit,
      action,
      pristine,
      reset,
      submitting,
      terms = [],
      password_type,
      onEdit,
      cardList,
      unit_price,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        sm: {span: 4},
      },
      wrapperCol: {
        sm: {span: 16},
      },
    };
    const req = value => (value || typeof value === 'number' ? undefined : 'Required');
    return (
      <div>
        <Form onSubmit={handleSubmit(this.save)}>
          <Field
            label="类型"
            name="card_type"
            component={ASelect}
            {...formItemLayout}
            style={{width: 200}}
            placeholder="请选择类型"
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
            label="单价"
            name="unit_price"
            parse={parseNumber}
            component={AInputNumber}
            {...formItemLayout}
            style={{width: 200}}
            disabled={!editing}
            addonAfter="RMB"
            precision={2}
            min={0}
          />

          <Field
            label="保障时间"
            name="guarantee_time"
            component={ASelect}
            {...formItemLayout}
            placeholder="请选择保障时间"
            style={{width: 200}}
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
            style={{width: 200}}
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
            style={{width: 200}}
            parse={parseNumber}
            min={0}
            precision={0}
            {...formItemLayout}
            placeholder="不填代表不限制"
            disabled={!editing}
          />

          {/*条件*/}
          <Field
            label="条件"
            name="password_type"
            component={ARadioGroup}
            {...formItemLayout}
            onChange={this.handleChangeType}
            disabled={!editing || action === 'edit'}
            placeholder=""
          >
            {map(CONFIG.cardPwdType, (text, value) => (
              <Radio key={value} value={+value}>
                {text}
              </Radio>
            ))}
          </Field>

          {
            editing && (
              <Button
                type="dashed"
                style={{width: '29%', marginLeft: '12%'}}
                onClick={this.showAddMoneyBox}
                disabled={!editing}
              >
                <Icon type="plus" /> 添加面额
              </Button>
            )
          }

          {this.renderModal()}

          <FieldArray
            name="cards"
            disabled={!editing}
            action={action}
            pswType={password_type}
            {...formItemLayout}
            component={this.renderCards}
          />

          <DescriptionList size="large" style={{marginBottom: 15, marginTop: 20}}>
            <Description style={{float: 'right'}} term="总面额">
              {formatMoney(this.calculateMoney()) || '0'}
            </Description>
          </DescriptionList>

          <DescriptionList size="large" style={{marginBottom: 15, marginTop: 20}}>
            <Description style={{float: 'right'}} term="总价">
              {formatMoney(unit_price * this.calculateMoney()) || '0'}
            </Description>
          </DescriptionList>

          {!editing ? (
            <Form.Item className={styles.buttonBox}>
              <Button key="back" onClick={this.handleCancel}>
                取消
              </Button>
              <Button key="edit" type="primary" className={styles.submit} onClick={onEdit}>
                编辑
              </Button>
            </Form.Item>
          ) : (
            <Form.Item className={styles.buttonBox}>
              <Button key="back" onClick={this.handleCancel} disabled={!!this.props.submitSellForm}>
                取消
              </Button>
              <Popconfirm
                title="确定发布吗？"
                onConfirm={handleSubmit(this.save)}
                okText="是"
                cancelText="否"
              >
                <Button
                  type="primary"
                  className={styles.submit}
                  htmlType="submit"
                  loading={this.props.submitSellForm}
                >
                  保存
                </Button>
              </Popconfirm>
            </Form.Item>
          )}
        </Form>
      </div>
    );
  }
}
