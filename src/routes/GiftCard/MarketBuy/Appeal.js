import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs, Button, Icon, Input, Steps, Avatar, Upload, Modal } from 'antd';
import styles from './appeal.less';
import StepModel from '../Step';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

@connect(({ card }) => ({
  card,
}))
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

  handleChange = ({ fileList }) => this.setState({ fileList });

  componentWillMount() {
    this.props.dispatch({
      type: 'card/getAppealInfo',
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { card } = this.props;
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
                    <div className={styles.editor}>
                      <TextArea rows={4} />
                    </div>
                    <Button type="primary">提交</Button>
                  </div>
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
