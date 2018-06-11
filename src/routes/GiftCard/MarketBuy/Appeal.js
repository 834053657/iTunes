import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Button, Icon, Input, Steps, Avatar, Upload, Modal } from 'antd';
import styles from './appeal.less';
import StepModel from '../Step';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

const FormItem = Form.Item;
@connect(({ card }) => ({
  card,
}))
@Form.create()
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleSubmit = e => {
    const { dispatch, card: { appeal: { data } } } = this.props;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        dispatch({
          type: 'send_message',
          payload: {
            order_id: data.order_id,
            content: values.content,
          },
          // callback: () => {}, // todo re-load appeal details
        });
      }
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  componentWillMount() {
    this.props.dispatch({
      type: 'card/getAppealInfo',
    });
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'enter_chat_room',
      payload: {
        order_id: 123,
      },
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'leave_chat_room',
      payload: {
        order_id: 123,
        room_id: 'xxx'
      },
    });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { card } = this.props;
    const { getFieldDecorator } = this.props.form;
    console.log('appeal');

    let appeal;
    if (card.appeal) {
      appeal = card.appeal.data;
      const info = appeal.appeal_info;

      const uploadButton = (
        <div>
          <Icon type="plus" />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
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
      return (
        <div className={styles.appeal}>
          <StepModel steps={steps} current={1} />
          <div className={styles.top}>
            <div className={styles.orderInfo}>
              <h5>
                <span>订单：</span>
                <span>15216524713875</span>
              </h5>
              <div className={styles.orderDescribe}>
                您向Jason购买总面额300的亚马逊美卡亚马逊美卡
              </div>
            </div>
            <div className={styles.tabs}>
              <Tabs animated={false} defaultActiveKey="1">
                <TabPane tab="订单详情" key="1">
                  <Detail />
                </TabPane>
                <TabPane tab="申诉中" key="2">
                  <AppealInfoAppealInfo info={info} />
                  <Form onSubmit={this.handleSubmit}>
                    <div className={styles.submitAppeal}>
                      <div>
                        <div className={styles.addPic}>
                          <span className={styles.addTitle}>上传图片:</span>
                          <div className={styles.addBox}>
                            <Upload
                              action="//jsonplaceholder.typicode.com/posts/"
                              listType="picture-card"
                              fileList={fileList}
                              onPreview={this.handlePreview}
                              onChange={this.handleChange}
                            >
                              {fileList.length >= 3 ? null : uploadButton}
                            </Upload>
                            <Modal
                              visible={previewVisible}
                              footer={null}
                              onCancel={this.handleCancel}
                            >
                              <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                          </div>
                        </div>
                      </div>
                      <FormItem label="" {...formItemLayout}>
                        {getFieldDecorator('content', {
                          rules: [
                            {
                              required: true,
                              message: '请输入您要提交的内容',
                            },
                          ],
                        })(
                          <TextArea
                            style={{ minHeight: 32 }}
                            placeholder="您的建议会督促我做得更好~"
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
                        提交
                      </Button>
                    </div>
                  </Form>
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function Detail() {
  return (
    <div className={styles.tabOne}>
      <div className={styles.left}>
        <ul>
          <li className={styles.item}>
            <span className={styles.title}>类型：</span>
            <div className={styles.content}>type[info.card_type].name</div>
          </li>
          <li className={styles.item}>
            <span className={styles.title}>单价：</span>
            <div className={styles.content}>info.unit_price RMB</div>
          </li>
          <li className={styles.item}>
            <span className={styles.title}>面额：</span>
            <div className={styles.content}>passwordType(info.password_type)</div>
          </li>
          <li className={styles.item}>
            <span className={styles.title}>总价：</span>
            <div className={styles.content}>amountMoney() RMB</div>
          </li>
          <li className={styles.item}>
            <span className={styles.title}>保障时间：</span>
            <div className={styles.content}>info.guarantee_time分钟</div>
          </li>
        </ul>
      </div>
      <div className={styles.stepBottomRight}>
        <div className={styles.largeBtnBox}>
          <Button>查看礼品卡清单</Button>
        </div>

        <div className={styles.ownerInfo}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Avatar size="large" icon="user" />
            </div>
            <div className={styles.avatarRight}>
              <div className={styles.top}>
                <span className={styles.name}>nickname</span>
                <span className={styles.online}>&nbsp;</span>
              </div>
              <div className={styles.infoBottom}>
                <span className={styles.dealTit}>30日成单：</span>
                <span className={styles.dealNum}>ownerInfo.month_volume</span>
              </div>
            </div>
          </div>
          <div className={styles.term}>
            <h3>交易条款：</h3>
            <p>info.term</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppealInfoAppealInfo(props) {
  const { info } = props;
  return (
    <div>
      <ul className={styles.tabTwoTab}>
        {info.map(i => {
          return (
            <li>
              <div className={styles.leftAvatar}>
                <span className={styles.avaTop}>
                  <Avatar className={styles.avatar} size="large" src={i.avatar} />
                </span>
                <span className={styles.avaName}>{i.user_name}</span>
              </div>
              <div className={styles.chatItem}>
                <p className={styles.chatText}>{i.content.cont}</p>
                <div className={styles.chatTime}>{new Date().toLocaleDateString()}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
