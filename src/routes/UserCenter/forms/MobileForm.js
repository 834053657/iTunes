import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select, Row, Col } from 'antd';
import classNames from 'classnames';
import styles from './MobileForm.less';

const FormItem = Form.Item;
const { Option } = Select;

class MobileForm extends Component {
  static defaultProps = {
    className: '',
    onGetCaptcha: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onGetCaptcha: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    count: 0,
  };

  componentDidMount() {
    clearInterval(this.interval);
  }

  handleSendCaptcha = () => {
    this.props.form.validateFields(
      ['telephone_code', 'telephone'],
      { force: true },
      (err, { telephone, telephone_code }) => {
        if (!err) {
          const nation_code = CONFIG.countrysMap[telephone_code].nation_code;
          this.props.onGetCaptcha({ nation_code, telephone }, () => {
            let count = 59;
            this.setState({ count });
            this.interval = setInterval(() => {
              count -= 1;
              this.setState({ count });
              if (count === 0) {
                clearInterval(this.interval);
              }
            }, 1000);
          });
        }
      }
    );
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { telephone_code, verify_code: code, telephone: phone } = values;
        const nation_code = CONFIG.countrysMap[telephone_code].nation_code;

        this.props.onSubmit({ nation_code, code, phone });
      }
    });
  };

  render() {
    const { className, form, initialValue = {}, submitting, disabled } = this.props;
    const { count } = this.state;
    const telephone_code = form.getFieldValue('telephone_code');
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };
    console.log(telephone_code);

    return (
      <div className={classNames(className, styles.login)}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="国家">
            {getFieldDecorator('telephone_code', {
              initialValue: initialValue.telephone_code,
              rules: [
                {
                  required: true,
                  message: '请选择国家！',
                },
              ],
            })(
              <Select disabled={disabled}>
                {CONFIG.country.map(item => (
                  <Option key={item.code} value={item.code}>
                    {item.name_cn}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="手机号码">
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('telephone', {
                  initialValue: initialValue.telephone,
                  rules: [
                    {
                      required: true,
                      message: '请输入手机号码！',
                    },
                  ],
                })(
                  <Input
                    disabled={disabled}
                    className={styles.mobile_input}
                    addonBefore={
                      telephone_code && CONFIG.countrysMap[telephone_code] ? (
                        <span>+{CONFIG.countrysMap[telephone_code].nation_code}</span>
                      ) : null
                    }
                    style={{ width: '100%' }}
                  />
                )}
              </Col>
              <Col span={8}>
                <Button
                  disabled={count}
                  className={styles.getCaptcha}
                  size="large"
                  onClick={this.handleSendCaptcha}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="验证码">
            {getFieldDecorator('verify_code', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(<Input size="large" placeholder="验证码" />)}
          </FormItem>
          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              下一步
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(MobileForm);
