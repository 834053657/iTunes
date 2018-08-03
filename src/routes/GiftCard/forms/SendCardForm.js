import React, { PureComponent, Component, Fragment } from 'react';
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
import { map, filter, omit, forEach, size, get } from 'lodash';
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
import { validate, parseNumber, createError, formatMoney } from '../../../utils/utils';
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
import { getAuthority } from '../../../utils/authority';

const FormItem = Form.Item;
const { Description } = DescriptionList;

@reduxForm({
  form: 'sendCard', // a unique name for this form
})
export default class ReduxForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { defaultValue, array } = this.props;
    array.push('cards', defaultValue);
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
        message: { _error: '请添加面额' },
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
            money: [{ required: true, type: 'number', message: '面额' }],
            receipt: { required: false, type: 'string', message: '凭证' },
          },
        },
      },
    };
  };

  save = values => {
    const { condition_type } = this.props;
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

  handleCancel = () => {
    this.props.reset();
    this.props.onCancel && this.props.onCancel();
  };

  handleChangeType = e => {
    this.props.array.removeAll('cards');
    this.setState({
      pswType: e,
    });
    console.log(e);
    // let type = e.target.value;
    // if(type === 1) {
    //   this.props.change('condition1', [{}])
    // }else {
    //   this.props.change('condition2', {})
    // }
  };

  showAddMoneyBox = () => {
    this.setState({ addDenoVisible: true });
  };

  handlerAddCard = () => {
    const { denoVaule } = this.state;
    const { cards } = this.props;
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
    const { denoVaule, addDenoVisible } = this.state;
    return (
      <Modal
        title="添加面额"
        width={400}
        destroyOnClose
        maskClosable={false}
        visible={addDenoVisible}
        onOk={this.handlerAddCard}
        onCancel={() => {
          this.setState({ addDenoVisible: false });
        }}
      >
        <Row>
          <Col style={{ width: 50, float: 'left', lineHeight: '30px' }}>面额:</Col>
          <Col style={{ width: 150, float: 'left' }}>
            <Input
              style={{ width: 150 }}
              placeholder="请输入面额"
              onChange={e => {
                this.setState({ denoVaule: +e.target.value });
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
      const { array } = this.props;
      const newItems = get(info, 'file.response.data.items') || [];

      newItems.map(item => array.push(fieldName, item));
      this.setState({
        uploading: false,
      });
    } else if (info.file.status === 'error') {
      this.setState({ uploading: false });
      message.error('上传错误，可能请求已过期，请刷新页面重试');
    }
  };

  renderCards = a => {
    const { fields, formitemlayout, meta, _error, defaultValue, pswType } = a;
    const { token, user } = getAuthority() || {};
    const { id } = user || {};
    const uploadProps = {
      name: 'file',
      action: `${CONFIG.base_url}/itunes/ad/cards/import`,
      showUploadList: false,
      headers: {
        'ITUNES-UID': id,
        'ITUNES-TOKEN': token,
        // 'bank_name': this.state.bankName,
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
        {defaultValue.map((cardItem, index, c) => {
          return (
            <Card
              style={{ marginTop: '10px' }}
              key={index}
              title={
                <div>
                  <span>{cardItem.money}面额</span>
                  <span>({cardItem.items.length})</span>
                  <div style={{ float: 'right' }}>
                    {/*<Spin spinning={this.state.uploading}>*/}
                    <Spin spinning={false}>
                      <Upload
                        onChange={info => this.handlerUpload(info, index, cardItem.items)}
                        {...uploadProps}
                      >
                        <Button>导入</Button>
                      </Upload>
                    </Spin>
                  </div>
                  <a
                    style={{ fontSize: 12, float: 'right', lineHeight: 3, marginRight: 10 }}
                    href="../../../../public/PasswordTemplate.xlsx"
                    download="PasswordTemplate.xlsx"
                  >
                    点击下载模板
                  </a>
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
                        name={cardItem.receipt}
                        component={AUpload}
                        // disabled={disabled || action === 'edit'}
                      />
                    </Col>
                  </Row>
                  <Divider style={{ marginBottom: 32 }} />
                </div>
              )}

              <FieldArray
                name={cardItem.items}
                {...formitemlayout}
                //disabled={disabled}
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
    const { fields, formitemlayout, meta, _error, disabled, pswType } = arg;
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
                      disabled={disabled || status}
                    />
                  </Col>
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
                      disabled={disabled || status}
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
      </div>
    );
  };

  calculateMoney = () => {
    const { cards } = this.props;
    let money = 0;
    let calculateMoney;
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
      handleSubmit,
      pristine,
      reset,
      submitting,
      password_type,
      onEdit,
      cardList,
      unit_price,
      defaultValue,
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
      <div>
        <Form onSubmit={handleSubmit(this.save)}>
          <FieldArray
            name="cards"
            pswType={password_type}
            defaultValue={defaultValue}
            {...formItemLayout}
            component={this.renderCards}
          />
          {/*
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
*/}

          {undefined ? (
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
              <Button key="back" onClick={this.handleCancel} disabled={this.props.submitSellForm}>
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
