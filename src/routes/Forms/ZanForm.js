import React, { Component } from 'react';
import { Form, Icon, Checkbox, Pop, Radio } from 'zent';
import { Input, Button } from 'antd';
import 'zent/css/index.css';

const {
  Field,
  FormInputField,
  FormCheckboxGroupField,
  FormRadioGroupField,
  createForm,
  FormSection,
  FieldArray,
} = Form;

class Hobbies extends React.Component {
  render() {
    const { fields } = this.props;
    return (
      <ul>
        <Button onClick={() => fields.push()} className="add-btn">
          添加兴趣爱好
        </Button>
        {fields.map((hobby, index, key) => {
          return (
            <li className="hobbies" key={`hobby${key}`}>
              <FormInputField
                name={`${hobby}`}
                type="text"
                label={`兴趣爱好${index + 1}:`}
                validations={{ required: true }}
                validationErrors={{ required: '请填写兴趣爱好' }}
              />
              <span className="del-btn" onClick={() => fields.remove(index)}>
                删除该爱好
              </span>
            </li>
          );
        })}
      </ul>
    );
  }
}

class Members extends React.Component {
  render() {
    const { fields } = this.props;
    return (
      <ul>
        {fields.length < 3 && (
          <Button onClick={() => fields.push({})} className="add-btn">
            添加成员
          </Button>
        )}
        {fields.map((member, index, key) => {
          return (
            <li className="members" key={`member${key}`}>
              <div className="member-title">
                <span>成员{index + 1}</span>
                <Pop centerArrow trigger="hover" content="删除该成员">
                  <Icon
                    className="del-btn"
                    type="close-circle"
                    onClick={() => fields.remove(index)}
                  />
                </Pop>
              </div>
              <FormInputField
                name={`${member}.name`}
                type="text"
                label="名字:"
                required
                validations={{ required: true }}
                validationErrors={{ required: '请填写成员名字' }}
              />
              <FormRadioGroupField
                name={`${member}.sex`}
                label="性别:"
                required
                validations={{
                  required(values, value) {
                    return value !== '';
                  },
                }}
                validationErrors={{
                  required: '请选择性别',
                }}
              >
                <Radio value="1">男</Radio>
                <Radio value="2">女</Radio>
              </FormRadioGroupField>
              <FieldArray name={`${member}.hobbies`} component={Hobbies} />
            </li>
          );
        })}
      </ul>
    );
  }
}

class FieldForm extends Component {
  state = {
    checkedList: [],
  };

  componentDidMount() {
    const { zentForm } = this.props;
    zentForm.initialize({
      name: '0',
      password: '0123',
      email: '9392',
    });
  }

  onCheckboxChange = checkedList => {
    this.setState({ checkedList });
  };

  submit = (values, zentForm) => {
    console.log(values);
  };

  resetForm = () => {
    this.props.zentForm.resetFieldsValue();
  };

  render() {
    const { handleSubmit, zentForm } = this.props;
    console.log(zentForm.getFormValues && zentForm.getFormValues());

    return (
      <Form horizontal onSubmit={handleSubmit(this.submit)}>
        {/* <FormInputField
          name="name"
          type="text"
          label="昵称:"
          helpDesc="正则校验"
          validations={{
            required: true,
            matchRegex: /^[a-zA-Z]+$/
          }}
          validationErrors={{
            required: '请填写昵称',
            matchRegex: '昵称只能是字母'
          }}
        />
        <FormInputField
          name="password"
          type="text"
          label="密码:"
          required
          helpDesc="非空校验"
          validations={{
            required: true
          }}
          validationErrors={{
            required: '请填写密码'
          }}
        />
        <FormInputField
          name="confirmPw"
          type="text"
          label="确认密码:"
          required
          helpDesc="与其他表单域对比校验"
          validations={{
            equalsField: 'password'
          }}
          validationErrors={{
            equalsField: '两次填写的密码不一致'
          }}
        />
        <FormInputField
          name="email"
          type="text"
          label="邮件:"
          helpDesc="邮件校验"
          validations={{
            isEmail: true
          }}
          validationErrors={{
            isEmail: '请填写正确的邮件'
          }}
        />
        <FormInputField
          name="url"
          type="text"
          label="个人网站链接:"
          helpDesc="超链接校验"
          validations={{
            isUrl: true
          }}
          validationErrors={{
            isUrl: '请填写正确的网址'
          }}
        />
        <FormInputField
          name="id"
          type="text"
          label="证件号码:"
          required
          helpDesc="自定义校验函数"
          validations={{
            matchRegex: /^\d+$/,
            format(values, value) {
              return value.length === 15 || value.length === 10
            }
          }}
          validationErrors={{
            matchRegex: '证件号码必须是数字',
            format: '证件号码是10位或者15位数字'
          }}
        />
        <FormCheckboxGroupField
          name="hobbies"
          type="text"
          label="兴趣标签:"
          value={this.state.checkedList}
          onChange={this.onCheckboxChange}
          required
          helpDesc="长度校验"
          validations={{
            minLength: 2
          }}
          validationErrors={{
            minLength: '请至少选择两个'
          }}
        >
          <Checkbox value="movie">电影</Checkbox>
          <Checkbox value="book">书籍</Checkbox>
          <Checkbox value="travel">旅行</Checkbox>
        </FormCheckboxGroupField>*/}
        <FieldArray name="members" component={Members} />
        <div className="zent-form__form-actions">
          <Button type="primary" htmlType="submit">
            获取表单值
          </Button>
          <Button onClick={this.resetForm}>重置表单值</Button>
        </div>
      </Form>
    );
  }
}

const WrappedForm = createForm()(FieldForm);

export default WrappedForm;
