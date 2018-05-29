import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Avatar, Divider, Upload, message, Button, Icon } from 'antd';

import styles from './UserCenterPage.less';

@connect(({ global, user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.global,
}))
export default class Analysis extends Component {
  state = {};

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'global/fetchBanners',
    // });
  }

  componentWillUnmount() {}

  render() {
    const { currentUser } = this.props;
    const { user = {} } = currentUser || {};

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
          <Col span={12}>
            <div className={styles.left}>
              <div className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={user.avatar} />
                <span>
                  <span className={styles.name}>{user.nickname}</span>
                  <span className={styles.name}>UID: {user.uid}</span>
                </span>
              </div>
              <div>
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </div>
              <Divider />
              <p>
                本帐号于<span>2017-11-13 15:31:16</span>注册, 首次交易在<span>
                  2018-01-19 10:56:39
                </span>
              </p>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.right}>
              {/* 账号与安全 */}
              <div className={styles.box}>
                <div className={styles.box_head}>
                  <div className={styles.box_head_wrapper}>
                    <div className={styles.box_head_title}>账号与安全</div>
                    <div className={styles.box_head_extra}>
                      <span>
                        安全等级: <span>低</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.box_content}>
                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="mail" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>邮箱</h4>
                        <div className={styles.box_item_descript}>未绑定</div>
                      </div>
                    </div>
                    <div className={styles.box_item_content}>970099734@1qq.com</div>
                    <ul className={styles.box_item_action}>
                      <li>
                        <a href="#">绑定</a>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="mobile" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>手机</h4>
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

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="chrome" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>谷歌验证码</h4>
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

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="unlock" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}>登录密码</h4>
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
          </Col>
        </Row>
      </Fragment>
    );
  }
}
