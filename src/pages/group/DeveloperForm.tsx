import { editDeveloper } from '@api/BaseAPI';
import FormItem from '@components/form-item';
import PageTitle from '@components/page-title/PageTitle';
import { Avatar, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';

import './index.less';

type ChangeAdminProps = {
  developer: any;
  onBack: Function;
};

const powerOptions = [
  {
    name: '无',
    value: 0,
  },
  {
    name: '查看',
    value: 1,
  },
  {
    name: '编辑',
    value: 2,
  },
];

export default function DeveloperForm(props: ChangeAdminProps) {
  const { developer, onBack } = props;

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [formValidate, setFormValidate] = useState(false);
  const [curFormData, setCurFormData] = useState({
    mobile: '',
    markInfo: '',
    all: 0,
    develop: 0,
    setting: 0,
  });
  const [validateMap, setValidateMap] = React.useState({
    mobile: false,
    markInfo: false,
  });

  const onFormItemChange = (model: string, value: any) => {
    const newCurFormData = { ...curFormData };
    newCurFormData[model] = value;
    setCurFormData(newCurFormData);
  };

  const onFormItemValidChange = (model: string, validate: boolean) => {
    const newValidateMap = { ...validateMap };
    let newFormValidate = true;
    newValidateMap[model] = validate;
    if (model === 'mobile') {
      if (validate) {
        setUser({
          nickname: '待联调',
          addTime: '2020-08-01 12:01:05',
          avatar: 'http://avatar.hitv.com/iT4FqEJ4sIVv9cm6yLI8fogRE1CIqU.jpg',
          uuid: '111',
        });
        if (!userChecked) {
          setUserChecked(true);
        }
      } else {
        setUser(null);
      }
    }
    for (const key in newValidateMap) {
      if (!newValidateMap[key]) newFormValidate = false;
    }
    setFormValidate(newFormValidate);
    setValidateMap(newValidateMap);
  };

  const onSave = async () => {
    setLoading(true);
    const { mobile, markInfo, all, develop, setting } = curFormData;
    const formatParams = {
      mobile,
      markInfo,
      accessList: [
        {
          type: 'all',
          op: all,
        },
        {
          type: 'develop',
          op: develop,
        },
        {
          type: 'setting',
          op: setting,
        },
      ],
    };
    const response = await editDeveloper(formatParams);
    const { data } = response;
    if (data.code !== 200) {
      message.error(data.msg);
    } else {
      message.success('保存成功！');
    }
    setLoading(false);
    onBack();
  };

  useEffect(() => {
    if (developer) {
      const {
        mobile,
        avatar,
        addTime,
        nickname,
        markInfo,
        all,
        setting,
        develop,
      } = developer;
      if (mobile) {
        setIsEdit(true);
        setCurFormData({
          mobile,
          markInfo,
          all,
          develop,
          setting,
        });
        setUser({
          addTime,
          avatar,
          nickname,
        });
        setUserChecked(true);
        setFormValidate(true);
        setValidateMap({
          mobile: true,
          markInfo: true,
        });
      } else {
        setIsEdit(false);
        setCurFormData({
          mobile: '',
          markInfo: '',
          all: 0,
          develop: 0,
          setting: 0,
        });
        setUser(null);
        setUserChecked(false);
        setFormValidate(false);
        setValidateMap({
          mobile: false,
          markInfo: false,
        });
      }
    }
  }, [developer]);

  return (
    <div className="page-developer-form">
      <PageTitle
        showBack
        title={isEdit ? '编辑协作者' : '添加协作者'}
        onBack={onBack}
      ></PageTitle>
      <div className="bind-module module-wapper">
        <div className="title">用户绑定</div>
        <div className="form-list module-content">
          <FormItem
            params={{
              model: 'mobile',
              label: '手机号码',
              required: true,
              type: 'mobile',
              disabled: isEdit,
              value: curFormData.mobile,
              bottomTip:
                userChecked && !user ? '对应用户不存在，请检查手机号码' : null,
            }}
            onChange={(value: any) => onFormItemChange('mobile', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('mobile', validate)
            }
          />
          <FormItem
            params={{
              model: 'markInfo',
              label: '备注',
              required: true,
              disabled: isEdit,
              value: curFormData.markInfo,
            }}
            onChange={(value: any) => onFormItemChange('markInfo', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('markInfo', validate)
            }
          />
        </div>
      </div>
      {user && userChecked ? (
        <div className="preview-module module-wapper">
          <div className="title">用户信息预览</div>
          <div className="info-wapper module-content">
            <div className="user-info">
              <Avatar size={88} src={user && user.avatar} />
              <div className="info-content">
                <div className="info-item name">
                  <div className="label">昵称</div>
                  <div className="content">
                    {(user && user.nickname) || ''}{' '}
                  </div>
                </div>
                <div className="info-item">
                  <div className="label">绑定时间</div>
                  <div className="content">{(user && user.addTime) || ''} </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="power-module module-wapper">
        <div className="title">权限设置</div>
        <div className="form-list module-content">
          <FormItem
            params={{
              model: 'all',
              label: '总览',
              required: true,
              type: 'selector',
              options: powerOptions,
              value: curFormData.all,
            }}
            onChange={(value: any) => onFormItemChange('all', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('all', validate)
            }
          />
          <FormItem
            params={{
              model: 'develop',
              label: '开发',
              required: true,
              type: 'selector',
              options: powerOptions,
              value: curFormData.develop,
            }}
            onChange={(value: any) => onFormItemChange('develop', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('develop', validate)
            }
          />
          <FormItem
            params={{
              model: 'setting',
              label: '设置',
              required: true,
              type: 'selector',
              options: powerOptions,
              value: curFormData.setting,
            }}
            onChange={(value: any) => onFormItemChange('setting', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('setting', validate)
            }
          />
        </div>
      </div>
      <div className="buttons">
        <Button
          className="saveBtn no-shadow middle-size"
          loading={loading}
          disabled={!formValidate}
          onClick={onSave}
        >
          保存
        </Button>
        <Button
          className="cancelBtn no-shadow middle-size"
          onClick={() => onBack()}
        >
          取消
        </Button>
      </div>
    </div>
  );
}
