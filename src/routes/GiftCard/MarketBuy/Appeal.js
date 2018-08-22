import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Tabs,
  Button,
  Icon,
  Input,
  Steps,
  Avatar,
  Upload,
  Modal,
  message,
  Badge,
} from 'antd';
import { map, orderBy } from 'lodash';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import moment from 'moment';
import cx from 'classnames';
import styles from './appeal.less';
import StepModel from '../Step';
import UploadComponent from './Upload';
import { formatMoney } from '../../../utils/utils';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

const FormItem = Form.Item;
const msg = defineMessages({
  error_message: {
    id: 'Appeal.error_message',
    defaultMessage: '上传错误，可能请求已过期，请刷新页面重试',
  },
  //发送成功
  send_success: {
    id: 'Appeal.send_success',
    defaultMessage: '发送成功',
  },
});
@injectIntl()
@connect(({ card, user }) => ({
  user,
  card,
}))
@Form.create()
export default class Appeal extends Component {
  constructor(props) {
    super();
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      imageUrls: [],
      textValue: '',
      shouldCleanPic: false,
      page: 1,
    };
    //当前订单ID
    this.id = props.orderId;
    this.appealPictures = null;
  }

  componentDidMount() {
    const { dispatch, detail: { order = {} } } = this.props;

    this.fetchData(order.id);
  }

  componentWillReceiveProps(nextProps) {
    if(__KG_API_ENV__ === 'dev'){return}
    const { detail: { order = {} } } = this.props;
    const { orderId: nextOrderId } = nextProps;

    if (nextOrderId && parseInt(nextOrderId) !== order.id) {
      this.fetchData(nextOrderId);
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'card/setChatMsgList',
      payload: { data: [] },
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handleSubmit = e => {
    const { dispatch, detail: { order = {} } } = this.props;
    const { imageUrls = [] } = this.state;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if ((!values.content || values.content.trim() === '') && imageUrls.length === 0) {
          message.error('请输入您要提交的内容或者图片!');
        } else {
          const content = this.getMsgContent(values.content);
          dispatch({
            type: 'send_message',
            payload: {
              order_id: order.id,
              ...content,
            },
            callback: () => {
              this.props.form.resetFields();
              this.setState({
                fileList: [],
                imageUrls: [],
              });
              message.success(this.props.intl.formatMessage(msg.send_success));
            },
          });
        }
      }
    });
  };

  getMsgContent = text => {
    const { imageUrls = [] } = this.state;
    let content = `<p>${breakLine(text) || ''}</p>`;
    content += imageUrls.length > 0 ? `<ul className="${styles.picbox}">` : '';
    map(imageUrls, (d, i) => {
      content += `<li class="{{float:left}}">
                  <img
                    height="120px"
                    src="${d}"
                    alt="#"
                  />
                </li>`;
    });
    content += imageUrls.length > 0 ? `</ul>` : '';

    return { content, image_url: imageUrls };
  };

  fetchData = (order_id, page) => {
    const { dispatch, detail: { order = {} } } = this.props;
    dispatch({
      type: 'card/fetchChatMsgList',
      payload: {
        order_id,
        order_msg_type: 2, // 1快捷短语  2 申诉
        goods_type: 2, // 1: 'itunes', 2: '礼品卡'
        page_size: 5,
        page: page || 1,
      },
    });
  };

  handleViewMore = () => {
    const {page = 1} = this.state;
    const { detail: { order = {} } } = this.props;
    console.log(123, order, page);

    this.setState({
      page: page + 1,
    });
    this.fetchData(order.id, page + 1);
  }

  handleChange = ({ fileList }) => this.setState({ fileList });

  count = order => {
    let a = 0;
    order.order_detail.map(o => {
      a += o.count;
      return a;
    });
    return a;
  };

  changeAppealPic = (info, prefix) => {
    const arr = [];
    info.fileList.map(file => {
      if (!file.response) {
        return false;
      }
      return arr.push(prefix + file.response.hash);
    });
    this.appealPictures = arr;
    this.setState({
      imageUrls: arr,
    });
  };

  getUserType = sender => {
    if (sender.buyer === 1 && sender.type === 'user') return '买家';
    else if (sender.buyer === 0 && sender.type === 'user') return '卖家';
    else if (sender.type === 'admin') return '客服';
    return null;
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  uploadHandler = info => {
    const { currentUser } = this.props.user || {};
    const { user = {}, upload = {} } = currentUser || {};
    this.changeAppealPic && this.changeAppealPic(info, upload.prefix);
    if (info.file.status === 'uploading') {
      this.setState({
        uploadLoading: true,
      });
    } else if (info.file.status === 'error') {
      this.setState({ uploadLoading: false });
      message.error(this.props.intl.formatMessage(msg.error_message));
    }
    this.setState({
      fileList: info.fileList,
    });
  };

  previewCard = steps => {
    this.props.dispatch({
      type: 'card/changePageStatus',
      payload: { page: 16, header: steps },
      //payload: 16,
    });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { card, appealInfo } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { currentUser } = this.props.user || {};
    const { user = {}, upload = {} } = currentUser || {};

    const { order = {}, ad, cards, trader, olderPageStatus } = this.props.detail || {};
    const { pageStatus, setStatus } = this.props;
    const { chatMsgList = [] } = card;
    const catdType =
      order.card_type && CONFIG.cardTypeMap[order.card_type]
        ? CONFIG.cardTypeMap[order.card_type].name
        : '-';

    let steps = null;
    steps = [{ title: <FM id="appeal.open_charge" defaultMessage="打开交易" /> }, { title: <FM id="appeal.sure_message" defaultMessage="确认信息" />  }, { title: <FM id="appeal.order_over" defaultMessage="完成" />  }];

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    let userInfo;

    if (pageStatus === 20 || pageStatus === 23) {
      userInfo = trader;
    } else if (pageStatus === 21 || pageStatus === 22) {
      userInfo = ad.owner;
    }

    return (
      <div className={styles.appeal}>
        <StepModel steps={steps} current={1} />
        <div className={styles.top}>
          <div className={styles.orderInfo}>
            <h5>
              <span>{PROMPT('order_all')}</span>
              <span>{order.order_no || '-'}</span>
            </h5>
            <div className={styles.orderDescribe}>
              {pageStatus === 20 && order.card_type && CONFIG.cardTypeMap
                ? <FM id="appeal.someone_toSell" defaultMessage="{name}向您出售总面额{money}的{card}" values={{name:trader.nickname,money:order.money,card:catdType}} /> //`${trader.nickname}向您出售总面额${order.money}的${catdType}`
                : null}
              {pageStatus === 21
                ? <FM id="appeal.toSomeone_toSell" defaultMessage="您向{name}出售总面额{money}的{card}" values={{name:ad.owner.nickname,money:order.money,card:catdType}} />  //`您向${ad.owner.nickname}出售总面额${order.money}的${catdType}`
                : null}
              {pageStatus === 22
                ? <FM id="appeal.toSomeone_toBuy" defaultMessage="您向{name}购买总面额{money}的{card}" values={{name:ad.owner.nickname,money:order.money,card:catdType}} /> //`您向${ad.owner.nickname}购买总面额${order.money}的${catdType}`
                : null}
              {pageStatus === 23
                ? <FM id="appeal.Someone_toBuy" defaultMessage="{name}向您购买总面额{money}的{card}" values={{name:trader.nickname,money:order.money,card:catdType}} /> //`${trader.nickname}向您购买总面额${order.money}的${catdType}`
                : null}
            </div>
          </div>
          <div className={styles.tabs}>
            <Tabs
              onChange={e => {
                if (+e === 1) {
                  this.props.setStatus('pageStatus', 14);
                }
              }}
              animated={false}
              defaultActiveKey={olderPageStatus === 16 ? '1' : '2'}
            >
              <TabPane tab={<FM id="appeal.order_detail" defaultMessage="订单详情" />}  key="1">
                <ul className={styles.orderDetail}>
                  <li className={styles.item}>
                    <span className={styles.title}><FM id="appeal.order_type" defaultMessage="类型：" /> </span>
                    <div className={styles.content}>
                      {order.card_type && CONFIG.cardTypeMap ? catdType || '-' : '-'}
                    </div>
                  </li>
                  <li className={styles.item}>
                    <span className={styles.title}><FM id="appeal.order_unit_price" defaultMessage="单价：" /> </span>
                    <div className={styles.content}>{formatMoney(ad.unit_price) || '-'}</div>
                  </li>
                  <li className={styles.item}>
                    <span className={styles.title}><FM id="appeal.amount_num" defaultMessage="数量：" /> </span>
                    <div className={styles.content}>{this.count(order) || '-'}</div>
                  </li>
                  <li className={styles.item}>
                    <span className={styles.title}><FM id="appeal.amount_all" defaultMessage="总面额：" /> </span>
                    <div className={styles.content}>{order.money || '-'}</div>
                  </li>
                  <li className={styles.item}>
                    <span className={styles.title}><FM id="appeal.amount_all_money" defaultMessage="总价：" /> </span>
                    <div className={styles.content}>
                      {order.amount ? formatMoney(order.amount) + 'RMB' : '-'}
                    </div>
                  </li>
                  <li className={styles.item}>
                    <span className={styles.title}><FM id="appeal.safe_time_" defaultMessage="保障时间：" /> </span>
                    <div className={styles.content}>
                      {ad.guarantee_time ? <FM id="appeal.order_minute" defaultMessage="{time}分钟" values={{time: ad.guarantee_time}} />  : '-'}
                    </div>
                  </li>
                </ul>

                <div className={styles.stepBottomRight}>
                  <div className={styles.largeBtnBox}>
                    <Button onClick={() => this.previewCard(steps)}><FM id="appeal.check_order_list" defaultMessage="查看礼品卡清单" /> </Button>
                  </div>
                  <div className={styles.ownerInfo}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        <Avatar size="large" src={userInfo.avatar} />
                      </div>
                      <div className={styles.avatarRight}>
                        <div className={styles.top}>
                          <Badge
                            status={userInfo.online ? 'success' : 'default'}
                            offset={[11, 10]}
                            dot
                          >
                            <span className={styles.name}>{userInfo.nickname}</span>
                          </Badge>
                        </div>
                        <div className={styles.infoBottom}>
                          <span className={styles.dealTit}><FM id="appeal.one_month_order" defaultMessage="30日成单：" /> </span>
                          <span className={styles.dealNum}>{userInfo.month_volume || '-'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.term}>
                      <h3><FM id="appeal.charge_rules" defaultMessage="交易条款：" /> </h3>
                      <p>{order.term}</p>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tab={<FM id="appeal.state_inTime" defaultMessage="申诉中" />}  key="2">
                <AppealInfo data={chatMsgList} onViewMore={this.handleViewMore} />
                <Form onSubmit={this.handleSubmit}>
                  <div className={styles.submitAppeal}>
                    <div>
                      <div className={styles.addPic}>
                        <span className={styles.addTitle}><FM id="appeal.upload_img" defaultMessage="上传图片:" /> </span>
                        <div className={styles.addBox}>
                          <Upload
                            name="file"
                            accept="image/*"
                            listType="picture-card"
                            fileList={this.state.fileList}
                            onPreview={this.handlePreview}
                            action={upload.domain}
                            onChange={this.uploadHandler}
                            data={{ token: upload.token }}
                          >
                            {this.state.fileList.length < 10 ? (
                              <div>
                                <Icon type="plus" />
                                <div className="ant-upload-text"><FM id="appeal.upload_test" defaultMessage="上传" /> </div>
                              </div>
                            ) : null}
                          </Upload>
                          <Modal
                            visible={this.state.previewVisible}
                            footer={null}
                            onCancel={this.handleCancel}
                          >
                            <img
                              alt="example"
                              style={{ width: '100%' }}
                              src={this.state.previewImage}
                            />
                          </Modal>
                        </div>
                      </div>
                    </div>
                    <FormItem label="" {...formItemLayout}>
                      {getFieldDecorator('content', {
                        rules: [
                          {
                            required: false,
                            message: <FM id="appeal.input_user_want" defaultMessage="请输入您要提交的内容" /> ,
                          },
                        ],
                      })(
                        <TextArea
                          style={{ minHeight: 32 }}
                          placeholder={PROMPT('dealFinish.user_evaluate_massage')}  //您的建议会督促我做得更好
                          rows={4}
                        />
                      )}
                    </FormItem>
                    <Button
                      // loading={submitting}
                      className={styles.submit}
                      type="primary"
                      htmlType="submit"
                    >
                      <FM id="appeal.message_submit" defaultMessage="提交" />
                    </Button>
                  </div>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

const breakLine = (v) => {
  const text = v && v.replace(/\n/g, '<br />');
  const regex = /(<br \/>)/g;
  const str = '';

  const arr = text.split(regex).map((line, index) => {
    return line.match(regex) ? `<br key=${`key_${  index}`} />` : line
  });
  return arr.join('');
}

const AppealInfo = props => {
  let {data: {items = [], total}} = props;
  items = orderBy(items, ['created_at'], ['asc']);
  return (
    <div>
      {
        total > items.length && (
          <div className={styles.viewMore}>
            {PROMPT('Appeal.check_msg')}<a onClick={props.onViewMore}>{PROMPT('Appeal.check_load')}</a>
          </div>)
      }
      <ul className={styles.tabTwoTab}>
        {map(items, d => {
          return (
            <li key={d.id} className={styles.appealItem}>
              <div className={styles.leftAvatar}>
                <span className={styles.avaTop}>
                  <Avatar
                    className={styles.avatar}
                    size="large"
                    src={d.sender && d.sender.avatar}
                  />
                </span>
                <span className={cx('name', styles.avaName)}>{d.sender && d.sender.nickname}</span>
                <br />
                <div style={{textAlign:'center'}}>
                  {d.sender &&
                    d.sender.buyer === 1 &&
                    d.sender.type === 'user' && <span className={styles.avaIdentify}><FM id="appeal.seller_" defaultMessage="卖家" /> </span>}
                  {d.sender &&
                    d.sender.buyer !== 1 &&
                    d.sender.type === 'user' && <span className={styles.avaIdentify}><FM id="appeal.buyer_" defaultMessage="买家" /> </span>}
                  {d.sender &&
                    d.sender.type === 'admin' && <span className={styles.avaAdmin}><FM id="appeal.service" defaultMessage="客服" /> </span>}
                </div>
              </div>
              <div className={styles.chatItem}>
                <div className={styles.chatText}>
                  <div
                    className={styles.chatBox}
                    dangerouslySetInnerHTML={{
                      __html: d.content && d.content.content,
                    }}
                  />
                </div>
                <div className={styles.chatTime}>
                  {moment(d.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
