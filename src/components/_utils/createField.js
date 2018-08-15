import React from 'react';
import { Form, Input, Radio, Select, Checkbox, Button } from 'antd';
import InputNumber from '../InputNumber';
import UploadQN from '../UploadQiNiu';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;

const createField = Component => ({
  input,
  meta,
  children,
  hasFeedback,
  label,
  required,
  labelCol,
  wrapperCol,
  colon,
  extra,
  extranode,
  ...rest
}) => {
  const hasError = meta.touched && meta.invalid;
  return (
    <FormItem
      wrapperCol={wrapperCol}
      labelCol={labelCol}
      required={required}
      label={label}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={hasFeedback && hasError}
      help={hasError && meta.error}
      colon={colon}
      extra={extra}
    >
      <Component {...input} {...rest} children={children} />
      {extranode}
    </FormItem>
  );
};

const AInput = createField(Input);
const ARadioGroup = createField(RadioGroup);
const ASelect = createField(Select);
const AOption = Select.Option;
const ACheckbox = createField(Checkbox);
const ATextarea = createField(TextArea);
const AInputNumber = createField(InputNumber);
const AUpload = createField(UploadQN);

export { AInput, ARadioGroup, ASelect, AOption, ACheckbox, ATextarea, AInputNumber, AUpload };
