import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Divider, Form, Input, Button } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import { delay } from 'lodash';
import styles from './TermsModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const msg = defineMessages({
  terms: {
    id: 'TeamModal.terms',
    defaultMessage: '交易条款',
  },
  add: {
    id: 'TeamModal.add',
    defaultMessage: '添加',
  },
  edit: {
    id: 'TeamModal.edit',
    defaultMessage: '编辑',
  },
  check: {
    id: 'TeamModal.check',
    defaultMessage: '查看',
  },
  title: {
    id: 'TeamModal.title',
    defaultMessage: '标题',
  },
  //-
  title_input: {
    id: 'TeamModal.title_input',
    defaultMessage: '请输入标题(1-20字符)',
  },
  title_input300: {
    id: 'TeamModal.title_input300',
    defaultMessage: '请输入交易条款(5-300字符)',
  },
  cancel: {
    id: 'TeamModal.cancel',
    defaultMessage: '取消',
  },
  sure: {
    id: 'TeamModal.sure',
    defaultMessage: '确定',
  },
  send: {
    id: 'TeamModal.send',
    defaultMessage: '提交',
  },

});
@Form.create()
export default class TermsModal extends Component {
  static defaultProps = {
    className: '',
    title: INTL(msg.terms),
    onCancel: () => {},
  };
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
  };

  handleSubmit = e => {
    const { action } = this.props;
    const id = action !== '_NEW' ? this.props.terms.id : null;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        this.props.dispatch({
          type: 'ad/saveTerms',
          payload: {
            id,
            title: values.title,
            content: values.content,
          },
          callback: this.props.onOK,
        });
      }
    });
  };

  handleOk = e => {
    console.log(e);
    this.handleSubmit(e);
  };

  render() {
    const { className, form, submitting, visible, title, onCancel, action, terms } = this.props;
    const { getFieldDecorator } = this.props.form;

    let modalTitle = action === '_NEW' ? INTL(msg.add) : action === '_EDIT' ? INTL(msg.edit) : INTL(msg.check);
    modalTitle += title;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const formItemLayoutTe = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        md: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
    };

    return (
      <Modal
        width={500}
        title={modalTitle}
        visible={visible}
        onCancel={this.props.onCancel}
        destroyOnClose
        maskClosable={false}
        footer={false}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label={INTL(msg.title)} {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: action === '_NEW' ? null : terms && terms.title,
              rules: [{ required: true, message: INTL(msg.title_input) }],
            })(<Input placeholder={INTL(msg.title)} maxLength={20} disabled={action === '_OPEN'} />)}
          </Form.Item>
          <FormItem label={INTL(msg.terms)} {...formItemLayout}>
            {getFieldDecorator('content', {
              initialValue: action === '_NEW' ? null : terms && terms.content,
              rules: [
                {
                  required: true,
                  message: INTL(msg.title_input300),
                },
              ],
            })(
              <TextArea
                style={{ minHeight: 32 }}
                placeholder={INTL(msg.terms)}
                maxLength={300}
                disabled={action === '_OPEN'}
                rows={4}
              />
            )}
          </FormItem>
          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.props.onCancel}>
              {action !== '_OPEN' ? INTL(msg.cancel) : INTL(msg.sure)}
            </Button>
            {action !== '_OPEN' && (
              <Button
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                {INTL(msg.send)}
              </Button>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
