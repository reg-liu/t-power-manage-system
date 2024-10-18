import { sendSMSCode } from '@api/AuthAPI';
import CategoryPicker from '@components/category-picker/CategoryPicker';
import FileUpload from '@components/file-upload/FileUpload';
import ImgUpload from '@components/img-upload/ImgUpload';
import { getLength } from '@Utils';
import { Button, DatePicker, Input, message, Radio, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import dayjs from 'dayjs';
import React from 'react';

import './index.less';

const prefixCls = 'form-item';

const Option = Select.Option;

const ErrorTypes = {
  required: 'required',
  minLength: 'minLength',
  maxLength: 'maxLength',
  lengthRange: 'lengthRange',
  custom: 'custom',
  wrongMobile: 'wrongMobile',
  wrongSms: 'wrongSms',
};

const ErrorMsgs = {
  required: '该输入项为必填项',
  minLength: '输入的字符长度不符合（至少{0}个字符）',
  maxLength: '输入的字符长度不符合（{最多0}个字符）',
  lengthRange: '输入的字符长度不符合（{0}-{1}个字符）',
  wrongMobile: '手机号码格式有误',
  wrongSms: '请输入6位数字的短信验证码',
};

const MobileRegex = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
const SmsCodeRegex = /^\d{6}$/;

type TParams = {
  model: string;
  type?: string;
  listLimit?: number;
  sizeLimit?: number;
  fixedImage?: string[];
  className?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  label: string;
  mobile?: string;
  rows?: number;
  fileType?: string;
  disabled?: boolean;
  bottomTip?: string;
  extraElement?: any;
  options?: any[];
  customValidate?: {
    fn: Function;
    errorMsg: string;
  };
  customParams?: any;
  value: any;
};

type FormItemProps = {
  params: TParams;
  onChange: Function;
  onFormItemValidChange?: Function;
};

const { RangePicker } = DatePicker;

export default function FormItem(props: FormItemProps) {
  const { params, onChange, onFormItemValidChange } = props;

  const [modifyed, setModifyed] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [verifyCodeDisableTime, setVerifyCodeDisableTime] = React.useState(0);
  const [errorParams, setErrorParams] = React.useState({
    type: '',
    msg: '',
  });

  const formatStr = (str: string, args?: any[]) => {
    let mapedStr = str;
    if ((args && args.length === 0) || !mapedStr) return mapedStr;
    if (args) {
      for (let i = 0; i < args.length; i++) {
        mapedStr = mapedStr.replace(
          new RegExp('\\{' + i + '\\}', 'g'),
          args[i]
        );
      }
    }
    return mapedStr;
  };

  const onValueChange = (value: any) => {
    setModifyed(true);
    onChange(value);
  };

  const onValidChange = (value: boolean) => {
    if (hasError === value) {
      setHasError(!value);
      if (onFormItemValidChange) onFormItemValidChange(value);
    }
    if (onFormItemValidChange) onFormItemValidChange(value);
  };

  const getVerifyCode = async (mobile: string) => {
    if (verifyCodeDisableTime) return;

    if (!MobileRegex.test(mobile)) {
      message.error('获取验证码失败，请检查手机号码是否填写正确');
      return false;
    }
    setVerifyCodeDisableTime(60);
    const response = await sendSMSCode(mobile);
    const { code, msg } = response.data;
    if (code === 200) {
      message.success('验证码发送成功！');
    } else {
      message.error(msg);
    }
  };

  const getFormItemContainer = () => {
    let formItem: any;
    switch (params.type) {
      case 'button':
        formItem = <Button />;
        break;
      case 'image':
        formItem = <ImgUpload params={params} onValueChange={onValueChange} />;
        break;
      case 'file':
        formItem = (
          <FileUpload type={params.fileType} onValueChange={onValueChange} />
        );
        break;
      case 'category-picker':
        formItem = (
          <CategoryPicker
            params={params}
            categoryList={params.customParams.categoryList}
            categoryMap={params.customParams.categoryMap}
            onValueChange={onValueChange}
          />
        );
        break;
      case 'radio':
        formItem = (
          <Radio.Group
            onChange={(e) => onValueChange(e.target.value)}
            value={params.value}
          >
            {params.options.map((item) => {
              return (
                <Radio value={item.value} key={item.value}>
                  {item.name}
                </Radio>
              );
            })}
          </Radio.Group>
        );
        break;
      case 'selector':
        formItem = (
          <Select value={params.value} onChange={onValueChange}>
            {params.options.map(({ name, value }) => {
              return <Option value={value}>{name}</Option>;
            })}
          </Select>
        );
        break;

      case 'range-picker':
        formItem = (
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            onChange={(dates, dateString) => {
              onValueChange(dateString);
            }}
            value={params.value.map((item) => {
              return item ? dayjs(item) : '';
            })}
          />
        );
        break;
      case 'sms':
        formItem = (
          <>
            <Input
              onChange={(e) => onValueChange(e.target.value)}
              placeholder="请输入"
              value={params.value}
            />
            <div className="ncode">
              <div
                className={`link ${verifyCodeDisableTime ? 'disable' : ''}`}
                onClick={() => {
                  getVerifyCode(params.mobile);
                }}
              >
                {verifyCodeDisableTime
                  ? `${verifyCodeDisableTime}s`
                  : '获取验证码'}
              </div>
            </div>
          </>
        );
        break;
      case 'mobile':
        formItem = (
          <Input
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="请输入"
            disabled={params.disabled}
            value={params.value}
          />
        );
        break;
      case 'textarea':
        formItem = (
          <TextArea
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="请输入"
            disabled={params.disabled}
            rows={params.rows || 4}
            value={params.value}
          />
        );
        break;
      default:
        formItem = (
          <Input
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="请输入"
            disabled={params.disabled}
            value={params.value}
          />
        );
    }
    return (
      <div
        className={`${prefixCls} ${hasError ? 'has-error' : ''} ${
          params.className || ''
        }`}
      >
        <div
          className={`${prefixCls}-label ${params.required ? 'required' : ''}`}
        >
          {params.label}
        </div>
        <div
          className={`${prefixCls}-content ${
            hasError ? 'ant-form-item-has-error' : ''
          }`}
        >
          {formItem}
        </div>
        {params.extraElement ? params.extraElement : null}
        <div className="error-msg">{errorParams.msg}</div>
        {params.bottomTip ? (
          <div className="bottom-tip">{params.bottomTip}</div>
        ) : null}
      </div>
    );
  };

  React.useEffect(() => {
    if (modifyed) {
      if (
        params.required &&
        !params.value.length &&
        params.type !== 'radio' &&
        params.type !== 'selector'
      ) {
        onValidChange(false);
        setErrorParams({
          msg: formatStr(ErrorMsgs.required, [params.label]),
          type: ErrorTypes.required,
        });
      }
      if (
        params.required &&
        params.fixedImage &&
        params.value.filter((item) => !item).length
      ) {
        onValidChange(false);
        setErrorParams({
          msg: formatStr(ErrorMsgs.required, [params.label]),
          type: ErrorTypes.required,
        });
      } else if (
        params.minLength &&
        !params.maxLength &&
        getLength(params.value) < params.minLength
      ) {
        onValidChange(false);
        setErrorParams({
          msg: formatStr(ErrorMsgs.minLength, [params.minLength]),
          type: ErrorTypes.minLength,
        });
      } else if (
        params.maxLength &&
        !params.minLength &&
        getLength(params.value) > params.maxLength
      ) {
        onValidChange(false);
        setErrorParams({
          msg: formatStr(ErrorMsgs.maxLength, [params.maxLength]),
          type: ErrorTypes.maxLength,
        });
      } else if (
        params.maxLength &&
        params.minLength &&
        (getLength(params.value) < params.minLength ||
          getLength(params.value) > params.maxLength)
      ) {
        onValidChange(false);
        setErrorParams({
          msg: formatStr(ErrorMsgs.lengthRange, [
            params.minLength,
            params.maxLength,
          ]),
          type: ErrorTypes.lengthRange,
        });
      } else if (
        params.customValidate &&
        !params.customValidate.fn(params.value)
      ) {
        onValidChange(false);
        setErrorParams({
          msg: params.customValidate.errorMsg,
          type: ErrorTypes.custom,
        });
      } else if (params.type === 'mobile' && !MobileRegex.test(params.value)) {
        onValidChange(false);
        setErrorParams({
          msg: ErrorMsgs.wrongMobile,
          type: ErrorTypes.wrongMobile,
        });
      } else if (params.type === 'sms' && !SmsCodeRegex.test(params.value)) {
        onValidChange(false);
        setErrorParams({
          msg: ErrorMsgs.wrongSms,
          type: ErrorTypes.wrongSms,
        });
      } else {
        onValidChange(true);
      }
    }
  }, [params.value]);

  return getFormItemContainer();
}
