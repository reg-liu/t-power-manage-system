import React, { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import AuthForm from './AuthForm';
import PageTitle from '@components/page-title/PageTitle';
import { Button, message } from 'antd';
import { getAuthInfo, saveAuthInfo } from '@api/BaseAPI';
import { CertTypePerson, CertTypeEnterprise } from '@config';
import useAuth from '@context/auth';

import './index.less';

type AuthProps = {
  isFlowCreate?: boolean;
  onSuccess?: Function;
};

const AuthCheckPrepare = 0;
const AuthChecking = 1;
const AuthCheckSuccess = 2;
const AuthCheckFail = 3;

const businessFormItem = [
  'business_name',
  'business_code',
  'business_img',
  'business_exp_type',
  'business_exp',
  'other_imgs',
  'tel',
];

export default function Auth(props: AuthProps) {
  const {
    state: { user },
  } = useAuth();

  const { isFlowCreate, onSuccess } = props;

  const [certInfo, setCertInfo] = useState({
    status: AuthCheckPrepare,
    info: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [formValidate, setFormValidate] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = useState({
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

  const onDataChange = (curFormData) => {
    setFormData(curFormData);
  };

  const doEdit = () => {
    setIsEdit(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const privateData = {
      cert_type: formData.cert_type,
      admin: formData.admin,
      idcard: formData.idcard,
      mobile: user.mobile,
      idcard_front: formData.idcard_image[0],
      idcard_back: formData.idcard_image[1],
    };
    let finalData = {};
    if (formData.cert_type === CertTypeEnterprise) {
      const businessData = {
        business_name: formData.business_name,
        business_code: formData.business_code,
        business_img: formData.business_img[0],
        business_exp_type: 1,
        business_exp_start: formData.business_exp[0],
        business_exp_end: formData.business_exp[1],
        other_imgs: formData.other_imgs.join(';'),
        tel: formData.tel,
      };
      finalData = { ...privateData, ...businessData };
    } else {
      finalData = { ...privateData };
    }
    onSuccess();
    if (
      certInfo.status === AuthCheckPrepare ||
      (isEdit && certInfo.status === AuthCheckFail)
    ) {
      const response = await saveAuthInfo(finalData);
      const { data } = response;
      if (data.code !== 200) {
        message.error(data.msg);
        setLoading(false);
      } else {
        setLoading(false);
        if (isFlowCreate) {
          onSuccess();
        } else {
          message.success('保存成功！');
          navigate('/overview');
        }
      }
    }
  };

  const doLeave = () => {
    navigate('/overview');
  };

  const onValidateChange = (curFormValidateMap) => {
    let newFormValidate = true;
    for (const key in curFormValidateMap) {
      if (curFormValidateMap.hasOwnProperty(key)) {
        if (formData.cert_type === CertTypePerson) {
          if (businessFormItem.includes(key)) continue;
        }
        if (!curFormValidateMap[key]) {
          newFormValidate = false;
        }
      }
    }
    setFormValidate(newFormValidate);
  };

  const requestAuthInfo = async () => {
    const response = await getAuthInfo();
    //TODO
    const { data } = response.data;
  };

  useEffect(() => {
    requestAuthInfo();
  }, []);

  useEffect(() => {
    if (user) {
      let newCertInfo = null;
      if (user.isCert) {
        newCertInfo = {
          status: AuthCheckSuccess,
          info: '',
        };
      } else {
        newCertInfo = {
          status: AuthCheckPrepare,
          info: '',
        };
      }
      setCertInfo(newCertInfo);
    }
  }, [user]);

  return (
    <div className={`page-auth ${isFlowCreate ? 'flow-create' : ''}`}>
      {certInfo.status === AuthCheckPrepare || isEdit ? (
        <>
          {isFlowCreate ? (
            <div className="title-wrapper">
              <div className="title">身份认证</div>
              <div className="desc">
                需要先完成身份认证后才能申请审核，认证类型分为企业开发者和个人开发者，
              </div>
              <div className="desc">
                不同身份的开发者所需上传的资料不同，小程序中能够申请的开放能力也有所差异。身份审核会在2个工作日内完成
              </div>
            </div>
          ) : (
            <PageTitle title="身份认证"></PageTitle>
          )}
          {user && !user.mobile ? null : (
            <div className="error">
              请先再我的 - 设置 - 账号与安全 -
              绑定手机中进行手机绑定，再进行身份认证
            </div>
          )}
          <AuthForm
            onDataChange={onDataChange}
            onValidateChange={onValidateChange}
            formData={formData}
            disable={user && !user.mobile}
          ></AuthForm>
          <div className="footer-wrapper">
            <Button
              loading={loading}
              disabled={!formValidate || !user.mobile}
              onClick={handleSubmit}
              className="saveBtn"
            >
              {isFlowCreate ? '下一步' : '保存'}
            </Button>
            {isFlowCreate ? (
              <Button onClick={doLeave} className="cancelBtn">
                离开
              </Button>
            ) : null}
          </div>
        </>
      ) : null}
      {certInfo.status === AuthChecking ? (
        <>
          <div className="status-wapper">
            <div className="status authing"></div>
            <div className="content">正在审核中...</div>
          </div>
          {isFlowCreate ? (
            <div className="footer-wrapper">
              <Button onClick={() => onSuccess()} className="saveBtn">
                下一步
              </Button>
              <Button onClick={doLeave} className="cancelBtn">
                离开
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
      {certInfo.status === AuthCheckSuccess && !isEdit ? (
        <>
          <div className="status-wapper">
            <div className="status auth-success"></div>
            <div className="content">
              审核成功！
              <div className="link" onClick={doEdit}>
                {'查看认证信息>'}
              </div>
            </div>
          </div>
          {isFlowCreate ? (
            <div className="footer-wrapper">
              <Button onClick={() => onSuccess()} className="saveBtn">
                下一步
              </Button>
              <Button onClick={doLeave} className="cancelBtn">
                离开
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
      {certInfo.status === AuthCheckFail && !isEdit ? (
        <>
          <div className="status-wapper">
            <div className="status auth-fail"></div>
            <div className="content">
              审核失败！
              <div className="link" onClick={doEdit}>
                {'修改认证信息>'}
              </div>
            </div>
            <div className="info">{certInfo.info}</div>
          </div>
          {isFlowCreate ? (
            <div className="footer-wrapper">
              <Button onClick={() => onSuccess()} className="saveBtn">
                下一步
              </Button>
              <Button onClick={doLeave} className="cancelBtn">
                离开
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
