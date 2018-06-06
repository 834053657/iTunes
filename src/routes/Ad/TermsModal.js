import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Divider, Form, Input } from 'antd';
import { delay } from 'lodash';
import styles from './TermsModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
export default class TermsModal extends Component {
  static defaultProps = {
    className: '',
    title: '交易条款',
    onCancel: () => {},
  };
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        this.props.dispatch({
          type: 'transferManage/updateStatusResult',
          payload: { id: this.state.rowId, status: values.status, log: values.reason },
          callback: this.refreshGrid
        });

        this.setState({
          showUpdate: false,
          showReason: false,
        });
      }
    });
  }

  showModal = (id) => {
    this.setState({
      showUpdate: true,
      showReason: false,
      rowId: id
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.handleSubmit(e);
    /* this.setState({
      showUpdateIDNo: false,
    }); */
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      showUpdate: false,
      showReason: false,
    });
  }

  render() {
    const { className, form, submitting, visible, title, onCancel, action } = this.props;
    const { getFieldDecorator } = this.props.form;

    let modalTitle = action === '_NEW' ? '添加' : (action === '_EDIT' ? '编辑' : '查看');
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
        onOk={this.handleOk}
        onCancel={this.props.onCancel}
        okText="保存"
        destroyOnClose
        maskClosable={false}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="标题" {...formItemLayout}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请输入标题' }],
            })(
              <Input />
            )}
          </Form.Item>
          <FormItem
            label="交易条款"
            {...formItemLayout}
          >
            {getFieldDecorator('reason', {
                rules: [{
                  required: true, message: '请输入内容',
                }],
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="内容" rows={4} />
              )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
