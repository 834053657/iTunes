import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Row, Col } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const FormItem = Form.Item;

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

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      this.props.onSubmit(err, values.code);
    });
  };

  loadCaptcha = () => {
    const isDev = process.env.NODE_ENV === 'development';
    this.setState({
      image: `${!isDev ? CONFIG.base_url : ''}/itunes/user/captcha?r=${Math.random()}`,
    });
  };

  render() {
    const { className, form, submitting, visible, title } = this.props;
    const { image } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Modal
        width={360}
        title={title}
        visible={visible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            确定
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
                        message: '请输入验证码！',
                      },
                    ],
                  })(<Input size="large" placeholder="验证码" />)}
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
