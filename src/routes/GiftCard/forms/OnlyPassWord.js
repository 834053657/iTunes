import React, { Component, Fragment } from 'react';
import { filter, last } from 'lodash';
import { FormattedMessage as FM, injectIntl } from 'react-intl';
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
  Row,
  Col,
  Upload,
  Spin,
  Popconfirm,
} from 'antd';
import styles from './FilterDemoinForm.less';

import PicUpload from '../../../components/UploadQiNiu/index';
import { getAuthority } from '../../../utils/authority';
import { getSystemUrl } from '../../../utils/utils';

const InputGroup = Input.Group;
const FormItem = Form.Item;

export default class OnlyPassWord extends Component {
  state = {
    uploading: false,
  };

  handleAdd = (c, i) => {
    this.props.addMoney(i);
  };

  handlerUpload = (info, index, length) => {
    if (info.file.status === 'uploading') {
      this.setState({
        uploading: true,
      });
    } else if (info.file.status === 'done') {
      this.reload = false;
      this.setState({
        uploading: false,
      });
      this.props.addFileData(info.file.response.data.items, index, length);
    } else if (info.file.status === 'error') {
      this.setState({ uploading: false });
      message.error(PROMPT('onlyPassWord.upload_default')); //上传错误，可能请求已过期，请刷新页面重试
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, resetForm },
      psw,
      action,
      sendCard,
      fileUpload,
    } = this.props;
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
          message.error(PROMPT('onlyPassWord.file_format')); //文件格式不对，您只能导入csv, xls或xlsx文件。
          return false;
        }
        return true;
      },
    };

    const formItemLayoutBtn = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const cards = this.props.dValue;

    return (
      <div>
        {cards.map((c, index) => {
          return (
            <Card
              style={{ marginTop: '10px' }}
              key={c.money}
              title={
                <div>
                  <span>
                    {c.money}
                    <FM id="onlyPassWord.amount_title" defaultMessage="面额" />
                  </span>
                  <span>({c.items.length})</span>
                  <div style={{ float: 'right' }}>
                    {psw === 1 && (
                      <Spin spinning={this.state.uploading}>
                        <Upload
                          onChange={info => this.handlerUpload(info, index, c.items.length)}
                          {...uploadProps}
                        >
                          <Button>
                            <FM id="onlyPassWord.upload_btn" defaultMessage="导入" />{' '}
                          </Button>
                        </Upload>
                      </Spin>
                    )}
                  </div>

                  {sendCard
                    ? null
                    : (!action || action === 'edit') &&
                      psw === 1 && (
                        <a
                          style={{ fontSize: 12, float: 'right', lineHeight: 3, marginRight: 10 }}
                          href="./PasswordTemplate.xlsx"
                          download="PasswordTemplate.xlsx"
                        >
                          点击下载模板
                        </a>
                      )}

                  {sendCard
                    ? null
                    : !action &&
                      cards.length !== 1 && (
                        <div style={{ float: 'right' }}>
                          <Popconfirm
                            title="确定删除吗？"
                            onConfirm={() => this.props.deleteCard(index)}
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
              {c.items.map((card, littleIndex) => {
                return (
                  <div key={littleIndex + 'littleIndex'} className={styles.itemLine}>
                    {//密码
                    (psw === 1 || psw === 3) && (
                      <FormItem required={false}>
                        {getFieldDecorator(`cards[${index}].items[${littleIndex}].password`, {
                          validateTrigger: ['onBlur'],
                          rules: [
                            {
                              required: true,
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
                          ],
                        })(
                          <Row>
                            <Col style={{ width: '6%', float: 'left' }}>卡密:</Col>
                            <Col style={{ width: '85%', float: 'left' }}>
                              <Input
                                defaultValue={card.password}
                                onChange={e => this.props.changePsw(e, index, littleIndex)}
                                placeholder="请输入卡密"
                                disabled={
                                  (action && action !== 'edit') ||
                                  (card.status && card.status !== 0)
                                }
                              />
                            </Col>
                            {sendCard
                              ? null
                              : (!action ||
                                  (action === 'edit' && card.status && card.status === 0)) &&
                                c.items.length !== 1 && (
                                  <Popconfirm
                                    title="确定删除吗？"
                                    onConfirm={() => this.props.confirm(index, littleIndex)}
                                    okText="是"
                                    cancelText="否"
                                  >
                                    <Icon className={styles.deleteIcon} type="minus-circle-o" />
                                  </Popconfirm>
                                )}
                          </Row>
                        )}
                      </FormItem>
                    )}

                    {//图片
                    (psw === 2 || psw === 3) && (
                      <FormItem required={false}>
                        {getFieldDecorator(`cards[${index}].items[${littleIndex}].picture`, {
                          initialValue: action ? card.picture : '',
                          //validateTrigger: ['onChange', 'onBlur'],
                          rules: [
                            {
                              required: true,
                              message: '请上传卡图',
                            },
                          ],
                        })(
                          <Row>
                            <Col style={{ width: '6%', float: 'left' }}>卡图:</Col>
                            <Col style={{ width: '85%', float: 'left' }}>
                              <PicUpload
                                onChange={e => this.props.changePic(e, index, littleIndex)}
                                value={card.picture}
                                disabled={
                                  (action && action !== 'edit') ||
                                  (card.status && card.status !== 0)
                                }
                              />
                            </Col>
                            {sendCard
                              ? null
                              : psw === 2 &&
                                c.items.length !== 1 &&
                                (!action || action === 'edit') && (
                                  <Popconfirm
                                    title="确定删除吗？"
                                    onConfirm={() => this.props.confirm(index, littleIndex)}
                                    okText="是"
                                    cancelText="否"
                                  >
                                    <Icon className={styles.deleteIcon} type="minus-circle-o" />
                                  </Popconfirm>
                                )}
                          </Row>
                        )}
                      </FormItem>
                    )}
                  </div>
                );
              })}

              {//凭证
              (psw === 2 || psw === 3) && (
                <FormItem required={false}>
                  {getFieldDecorator(`cards[${index}].receipt`, {
                    initialValue: action ? c.receipt : '',
                    //validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: false,
                        message: '请上传凭证',
                      },
                    ],
                  })(
                    <Row>
                      <Col style={{ width: '6%', float: 'left' }}>凭证:</Col>
                      <Col style={{ width: '85%', float: 'left' }}>
                        <PicUpload
                          onChange={e => this.props.changePZ(e, index)}
                          value={c.receipt}
                          disabled={action}
                        />
                      </Col>
                    </Row>
                  )}
                </FormItem>
              )}

              {sendCard ? null : (
                <FormItem {...formItemLayoutBtn}>
                  <Button
                    type="dashed"
                    onClick={() => this.handleAdd(c, index)}
                    style={{ width: '60%' }}
                    disabled={action && action !== 'edit'}
                  >
                    <Icon type="plus" /> 添加卡密
                  </Button>
                </FormItem>
              )}
            </Card>
          );
        })}
      </div>
    );
  }
}
