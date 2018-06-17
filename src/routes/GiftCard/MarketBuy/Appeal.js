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
        room_id: 'xxx',
      },
    });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { card } = this.props;
    const { getFieldDecorator } = this.props.form;

    const { order, ad, cards, trader } = this.props.detail;
    const { pageStatus, setStatus } = this.props;

    let steps = null;
    steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];

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
                <span>{order.order_no || '-'}</span>
              </h5>
              <div className={styles.orderDescribe}>
                {pageStatus === 20
                  ? `${trader.nickname}向您出售总面额${order.money}的${
                      CONFIG.card_type[order.order_type].name
                    }`
                  : null}
                {pageStatus === 21
                  ? `您向${ad.owner.nickname}出售总面额${order.money}的${
                      CONFIG.card_type[order.order_type].name
                    }`
                  : null}
                {pageStatus === 22
                  ? `您向${ad.owner.nickname}购买总面额${order.money}的${
                      CONFIG.card_type[order.order_type].name
                    }`
                  : null}
                {pageStatus === 23
                  ? `${trader.nickname}向您购买总面额${order.money}的${
                      CONFIG.card_type[order.order_type].name
                    }`
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
                defaultActiveKey="2"
              >
                <TabPane tab="订单详情" key="1">
                  d
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

function AppealInfoAppealInfo(props) {
  const { info } = props;
  return (
    <div>
      <ul className={styles.tabTwoTab}>
        {info.map((i, index) => {
          return (
            <li key={index}>
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
