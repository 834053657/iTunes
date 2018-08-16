import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Row, Col } from 'antd';
import { FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import classNames from 'classnames';
import styles from './index.less';
import { getCaptcha } from '../../services/api';

const FormItem = Form.Item;
const msg = defineMessages({
  indexPage_code_inp: {
    id: 'UserLogin.indexPage_code_inp',
    defaultMessage: '验证码',
  },
});
@injectIntl()
class ImageValidation extends Component {
  static defaultProps = {
    className: '',
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    image: null,
  };

  componentDidMount() {
    this.loadCaptcha();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && nextProps.visible !== this.props.visible) {
      this.loadCaptcha();
    }
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      this.props.onSubmit(err, values.code, this.loadCaptcha);
    });
  };

  loadCaptcha = async () => {
    const params = {
      r: Math.random(),
      usage: 'login',
    };
    const res = await getCaptcha(params);
    if (res.data) {
      this.setState({
        image: res.data.img,
      });
    }
  };

  render() {
    const { className, form, submitting, visible, title } = this.props;
    const { image } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Modal
        destroyOnClose
        width={360}
        title={title}
        visible={visible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            <FM id='UserLogin.indexPage_cancel' defaultMessage='取消' />
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            <FM id='UserLogin.indexPage_confirm' defaultMessage='确定' />
          </Button>,
        ]}
      >
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message: <FM id='UserLogin.indexPage_code_input' defaultMessage='请输入验证码！' />,
                      },
                    ],
                  })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.indexPage_code_inp)} />)}
                </Col>
                <Col span={8}>
                  <img
                    alt="captcha"
                    src={image}
                    onClick={this.loadCaptcha}
                    className={styles.captcha}
                  />
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
export default Form.create()(ImageValidation);
