import FormItem from '@components/form-item';
import PageTitle from '@components/page-title/PageTitle';
import { Avatar, Button, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';

import './index.less';

type ChangeAdminProps = {
  admin: any;
  onBack: Function;
};

export default function ChangeAdmin(props: ChangeAdminProps) {
  const { admin, onBack } = props;

  const [loading, setLoading] = useState(false);
  const [curFormData, setCurFormData] = useState({
    cur_sms: '',
    new_mobile: '',
    new_sms: '',
  });

  const [validateMap, setValidateMap] = React.useState({
    cur_sms: false,
    new_mobile: false,
    new_sms: false,
  });

  const onFormItemChange = (model: string, value: any) => {
    const newCurFormData = { ...curFormData };
    newCurFormData[model] = value;
    setCurFormData(newCurFormData);
  };

  const onFormItemValidChange = (model: string, validate: boolean) => {
    const newValidateMap = { ...validateMap };
    newValidateMap[model] = validate;
    setValidateMap(newValidateMap);
  };

  const onSave = () => {
    setLoading(true);
    setLoading(false);
    onBack();
  };

  return (
    <div className="page-change-group">
      <PageTitle showBack title="更改管理员" onBack={onBack}></PageTitle>
      <div className="admin-module module-wapper">
        <div className="title">当前管理员</div>
        <div className="info-wapper">
          <div className="admin-info">
            <Avatar size={88} src={admin && admin.avatar} />
            <div className="info-content">
              <div className="info-item name">
                <div className="label">昵称</div>
                <div className="content">
                  {(admin && admin.nickname) || ''}{' '}
                </div>
              </div>
              <div className="info-item">
                <div className="label">手机号码</div>
                <div className="content">{(admin && admin.mobile) || ''} </div>
              </div>
              <div className="info-item">
                <div className="label">绑定时间</div>
                <div className="content">{(admin && admin.addTime) || ''} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="change-module module-wapper">
        <div className="title">管理员验证</div>
        <div className="form-wapper">
          <FormItem
            params={{
              model: 'new_mobile',
              label: '新管理员手机号',
              required: true,
              value: curFormData.new_mobile,
              type: 'mobile',
            }}
            onChange={(value: any) => onFormItemChange('new_mobile', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('new_mobile', validate)
            }
          />
          <FormItem
            params={{
              model: 'new_sms',
              label: '新管理员验证码',
              required: true,
              value: curFormData.new_sms,
              mobile: curFormData.new_mobile,
              type: 'sms',
            }}
            onChange={(value: any) => onFormItemChange('new_sms', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('new_sms', validate)
            }
          />
          <div className="buttons">
            <Popconfirm
              title="确认删除?"
              cancelText="取消"
              okText="确定"
              okButtonProps={{
                className: 'saveBtn small-size',
              }}
              cancelButtonProps={{
                className: 'cancelBtn small-size',
              }}
              onConfirm={() => onSave()}
            >
              <Button className="saveBtn" loading={loading}>
                确认
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </div>
  );
}
