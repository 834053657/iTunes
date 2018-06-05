import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link } from 'dva/router';
import { Row, Col, Avatar, Divider, Upload, message, Button, Icon, Modal } from 'antd';
import G2Validation from 'components/G2Validation';
import EmailModal from './Modals/EmailModal';
import MobileModal from './Modals/MobileModal';
import PasswordForm from './forms/PasswordForm';
import styles from './UserCenterPage.less';
import RealNameForm from './forms/RealNameForm';

@connect(({ global, user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.global,
}))
export default class Analysis extends Component {
  state = {
    emailModalVisible: false,
    mobileModalVisible: false,
    pwdModalVisible: false,
    g2ModalVisible: false,
    realNameModalVisible: false,
  };

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'global/fetchBanners',
    // });
  }

  componentWillUnmount() {}

  hideEmailModal = () => {
    this.setState({
      emailModalVisible: false,
    });
  };

  showEmailModal = () => {
    this.setState({
      emailModalVisible: true,
    });
  };

  hideMobilelModal = () => {
    this.setState({
      mobileModalVisible: false,
    });
  };

  showMobileModal = () => {
    this.setState({
      mobileModalVisible: true,
    });
  };

  hidePwdlModal = () => {
    this.setState({
      pwdModalVisible: false,
    });
  };

  showPwdeModal = () => {
    this.setState({
      pwdModalVisible: true,
    });
  };

  handlePwdSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitChangePassword',
        payload: {
          ...values,
        },
        callback: this.hidePwdlModal,
      });
    }
  };

  showG2Modal = () => {
    this.setState({
      g2ModalVisible: true,
    });
  };

  hideG2Modal = () => {
    this.setState({
      g2ModalVisible: false,
    });
  };

  handleSubmitG2 = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitChangeG2Validate',
        payload: {
          enable: false,
          code: values.code,
        },
        callback: this.hideG2Modal,
      });
    }
  };

  showRealNameModal = () => {
    this.setState({
      realNameModalVisible: true,
    });
  };

  hideRealNameModal = () => {
    this.setState({
      realNameModalVisible: false,
    });
  };

  handleSubmitRealName = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitUserAuth',
        payload: {
          enable: false,
          code: values.code,
        },
        callback: this.hideRealNameModal,
      });
    }
  };

  renderPwdModal = () => {
    const { pwdModalVisible } = this.state;
    return (
      <Modal
        width={500}
        title="修改密码"
        visible={pwdModalVisible}
        onCancel={this.hidePwdlModal}
        maskClosable={false}
        footer={null}
      >
        {pwdModalVisible && (
          <PasswordForm onCancel={this.hidePwdlModal} onSubmit={this.handlePwdSubmit} />
        )}
      </Modal>
    );
  };

  renderRealNameModal = () => {
    const { realNameModalVisible } = this.state;
    return (
      <Modal
        width={500}
        title="修改密码"
        visible={realNameModalVisible}
        onCancel={this.hideRealNameModal}
        maskClosable={false}
        footer={null}
      >
        {realNameModalVisible && (
          <RealNameForm onCancel={this.hideRealNameModal} onSubmit={this.handleSubmitRealName} />
        )}
      </Modal>
    );
  };

  handleGetLevel = user => {
    let level = <span className={styles.low}>低</span>;
    if (user.email) {
      level = <span className={styles.low}>低</span>;
    }
    if (user.email && user.telephone) {
      level = <span className={styles.middle}>中</span>;
    }
    if (user.email && user.telephone && user.g2fa_on) {
      level = <span className={styles.hight}>高</span>;
    }

    return level;
  };

  render() {
    const {
      emailModalVisible,
      mobileModalVisible,
      g2ModalVisible,
      realNameModalVisible,
    } = this.state;
    const { currentUser } = this.props;
    const { auth, user = {} } = currentUser || {};
    const { real_name = {} } = auth || {};

    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <Fragment>
        <Row gutter={24} className={styles.user_center}>
          <Col span={8}>
            <div className={styles.left}>
              <div className={styles.left_wrapper}>
                <div className={styles.user_info}>
                  <Avatar size="lager" className={styles.avatar} src={user.avatar} />
                  <div className={styles.info}>
                    <div className={styles.name}>{user.nickname}</div>
                    <div className={styles.uid}>UID: {user.id}</div>
                  </div>
                </div>
                <div>
                  <Upload {...props}>
                    <Button>
                      <Icon type="upload" /> 上传头像
                    </Button>
                  </Upload>
                </div>
                <Divider />
                <p>
                  本帐号于<span> 2017-11-13 15:31:16 </span>注册, <br />
                  首次交易在<span> 2018-01-19 10:56:39</span>
                </p>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.right}>
              {/* 账号与安全 */}
              <div className={styles.box}>
                <div className={styles.box_head}>
                  <div className={styles.box_head_wrapper}>
                    <div className={styles.box_head_title}>账号与安全</div>
                    <div className={styles.box_head_extra}>
                      <span>安全等级: {this.handleGetLevel(user)}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.box_content}>
                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="mail" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>邮箱</h4>
                        <div className={styles.box_item_descript}>
                          {user.email ? '已绑定' : '未绑定'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.box_item_content}>{user.email}</div>
                    <ul className={styles.box_item_action}>
                      <li>
                        <a onClick={this.showEmailModal}>{user.email ? '修改' : '绑定'}</a>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="mobile" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>手机</h4>
                        <div className={styles.box_item_descript}>
                          {user.telephone ? '已绑定' : '未绑定'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.box_item_content}>{user.telephone}</div>
                    <ul className={styles.box_item_action}>
                      <li>
                        <a onClick={this.showMobileModal}>{user.telephone ? '修改' : '绑定'}</a>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="chrome" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>谷歌验证码</h4>
                        <div className={styles.box_item_descript}>
                          {user.g2fa_on ? '已绑定' : '未绑定'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.box_item_content} />
                    <ul className={styles.box_item_action}>
                      <li>
                        {user.g2fa_on ? (
                          <a onClick={this.showG2Modal}>停用</a>
                        ) : (
                          <Link to="/user-center/g2validate">设置</Link>
                        )}
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="unlock" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>登录密码</h4>
                        <div className={styles.box_item_descript}>已绑定</div>
                      </div>
                    </div>
                    <div className={styles.box_item_content} />
                    <ul className={styles.box_item_action}>
                      <li>
                        <a onClick={this.showPwdeModal}>修改</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 身份认证 */}
              <div className={styles.box}>
                <div className={styles.box_head}>
                  <div className={styles.box_head_wrapper}>
                    <div className={styles.box_head_title}>身份认证</div>
                  </div>
                  <div className={styles.box_head_subtitle}>
                    请如实填写您的身份信息，一经认证不可修改
                  </div>
                </div>
                <div className={styles.box_content}>
                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="idcard" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>实名认证</h4>
                        <div className={styles.box_item_descript}>
                          {real_name.status && CONFIG.auth_status[real_name.status]
                            ? CONFIG.auth_status[real_name.status]
                            : CONFIG.auth_status[1]}
                        </div>
                      </div>
                    </div>
                    <div className={styles.box_item_content} />
                    <ul className={styles.box_item_action}>
                      <li>
                        <a onClick={this.showRealNameModal}>编辑</a>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="video-camera" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>视频认证</h4>
                        <div className={styles.box_item_descript}>未绑定</div>
                      </div>
                    </div>
                    <div className={styles.box_item_content} />
                    <ul className={styles.box_item_action}>
                      <li>
                        <a href="#">编辑</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 支付方式 */}
              <div className={styles.box}>
                <div className={styles.box_head}>
                  <div className={styles.box_head_wrapper}>
                    <div className={styles.box_head_title}>支付方式</div>
                  </div>
                </div>
                <div className={styles.box_content}>
                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="credit-card" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>银行卡</h4>
                        <div className={styles.box_item_descript}>未认证</div>
                      </div>
                    </div>
                    <div className={styles.box_item_content}>
                      <div className={styles.mb4}>json</div>
                      <div>430511199321</div>
                    </div>
                    <ul className={styles.box_item_action}>
                      <li>
                        <a href="#">设置</a>
                      </li>
                      <li>
                        <a href="#">删除</a>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="red-envelope" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>支付宝</h4>
                        <div className={styles.box_item_descript}>未认证</div>
                      </div>
                    </div>
                    <div className={styles.box_item_content} />
                    <ul className={styles.box_item_action}>
                      <li>
                        <a href="#">设置</a>
                      </li>
                      <li>
                        <a href="#">删除</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {emailModalVisible && (
              <EmailModal
                {...this.props}
                email={user.email}
                visible={emailModalVisible}
                onCancel={this.hideEmailModal}
              />
            )}

            {mobileModalVisible && (
              <MobileModal
                {...this.props}
                visible={mobileModalVisible}
                onCancel={this.hideMobilelModal}
              />
            )}

            {this.renderPwdModal()}

            <G2Validation
              title="安全验证"
              visible={g2ModalVisible}
              onCancel={this.hideG2Modal}
              onSubmit={this.handleSubmitG2}
            />

            {this.renderRealNameModal()}
          </Col>
        </Row>
      </Fragment>
    );
  }
}
