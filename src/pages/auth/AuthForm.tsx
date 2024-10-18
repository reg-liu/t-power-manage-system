import React, { useEffect, useState } from 'react';
import './index.less';
import FormItem from '@components/form-item';
import { CertTypeEnterprise, CertTypePerson } from '@config';

type AuthFormProps = {
  formData: any;
  onDataChange: Function;
  onValidateChange: Function;
  disable: boolean;
};

export default function AuthForm(props: AuthFormProps) {
  const { formData, onDataChange, onValidateChange, disable } = props;
  const [validateMap, setValidateMap] = React.useState({
    admin: false,
    idcard: false,
    idcard_image: false,
    business_name: false,
    business_code: false,
    business_img: false,
    business_exp: false,
    other_imgs: false,
    tel: false,
  });

  const [curFormData, setCurFormData] = useState({
    cert_type: CertTypePerson, // 认证类型 1-个人 2-企业
    admin: '',
    idcard: '',
    idcard_image: ['', ''],
    business_name: '',
    business_code: '',
    business_img: [],
    business_exp_type: 1, //1-起始年月  2-永久
    business_exp: ['', ''],
    other_imgs: [],
    tel: '',
  });

  const onFormItemChange = (model: string, value: any) => {
    const newCurFormData = { ...curFormData };
    newCurFormData[model] = value;
    setCurFormData(newCurFormData);

    const formatData = {
      ...newCurFormData,
    };
    onDataChange(formatData);
  };

  const onFormItemValidChange = (model: string, validate: boolean) => {
    const newValidateMap = { ...validateMap };
    newValidateMap[model] = validate;
    setValidateMap(newValidateMap);
    onValidateChange(newValidateMap);
  };

  useEffect(() => {
    setCurFormData(formData);
  }, []);

  return (
    <div className="auth-form">
      <div className="input-wrapper module-wapper">
        <div className="wrapper-content">
          {disable ? <div className="form-mask"></div> : null}
          <FormItem
            params={{
              model: 'name',
              label: '身份类型',
              required: true,
              type: 'radio',
              options: [
                {
                  value: CertTypePerson,
                  name: '个人开发者',
                },
                {
                  value: CertTypeEnterprise,
                  name: '企业开发者',
                },
              ],
              value: curFormData.cert_type,
            }}
            onChange={(value: any) => onFormItemChange('cert_type', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('cert_type', validate)
            }
          />
          <FormItem
            params={{
              model: 'admin',
              label: '管理员姓名',
              required: true,
              value: curFormData.admin,
            }}
            onChange={(value: any) => onFormItemChange('admin', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('admin', validate)
            }
          />
          <FormItem
            params={{
              model: 'idcard',
              label: '身份证号码',
              required: true,
              value: curFormData.idcard,
              customValidate: {
                fn: (value: any) => {
                  return /(^\d{15}$)|(^\d{17}(\d|X)$)/.test(value);
                },
                errorMsg: '请输入正确的身份证号码',
              },
            }}
            onChange={(value: any) => onFormItemChange('idcard', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('idcard', validate)
            }
          />
          <FormItem
            params={{
              model: 'idcard_image',
              label: '身份证照片',
              required: true,
              type: 'image',
              listLimit: 2,
              sizeLimit: 5,
              fixedImage: ['正面照片', '反面照片'],
              value: curFormData.idcard_image,
              bottomTip: '图片格式为：png，jpg；不可大于5M。',
            }}
            onChange={(value: any) => onFormItemChange('idcard_image', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('idcard_image', validate)
            }
          />
          {curFormData.cert_type === CertTypeEnterprise ? (
            <>
              <FormItem
                params={{
                  model: 'business_name',
                  label: '执业执照名称',
                  required: true,
                  value: curFormData.business_name,
                }}
                onChange={(value: any) =>
                  onFormItemChange('business_name', value)
                }
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('business_name', validate)
                }
              />
              <FormItem
                params={{
                  model: 'business_code',
                  label: '统一社会信息代码',
                  required: true,
                  value: curFormData.business_code,
                }}
                onChange={(value: any) =>
                  onFormItemChange('business_code', value)
                }
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('business_code', validate)
                }
              />
              <FormItem
                params={{
                  model: 'business_img',
                  label: '执业执照照片',
                  required: true,
                  type: 'image',
                  listLimit: 1,
                  sizeLimit: 5,
                  value: curFormData.business_img,
                  bottomTip: '图片格式为：png，jpg；不可大于5M。',
                }}
                onChange={(value: any) =>
                  onFormItemChange('business_img', value)
                }
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('business_img', validate)
                }
              />
              <FormItem
                params={{
                  model: 'business_exp',
                  label: '执业执照有效期',
                  required: true,
                  type: 'range-picker',
                  value: curFormData.business_exp,
                }}
                onChange={(value: any) =>
                  onFormItemChange('business_exp', value)
                }
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('business_exp', validate)
                }
              />
              <FormItem
                params={{
                  model: 'other_imgs',
                  label: '其他资料',
                  required: true,
                  type: 'image',
                  listLimit: 5,
                  sizeLimit: 5,
                  value: curFormData.other_imgs,
                  bottomTip: '图片格式为：png，jpg；不可大于5M。',
                }}
                onChange={(value: any) => onFormItemChange('other_imgs', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('other_imgs', validate)
                }
              />
              <FormItem
                params={{
                  model: 'tel',
                  label: '客服电话',
                  required: true,
                  value: curFormData.tel,
                  customValidate: {
                    fn: (value: any) => {
                      return /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/.test(
                        value
                      );
                    },
                    errorMsg: '电话号码格式有误',
                  },
                }}
                onChange={(value: any) => onFormItemChange('tel', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('tel', validate)
                }
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
