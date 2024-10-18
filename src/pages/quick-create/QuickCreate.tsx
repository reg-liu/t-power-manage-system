import React, { useEffect, useState } from 'react';
import { navigate } from '@reach/router';
import './index.less';
import QuickCreateForm from './QuickCreateForm';
import PageTitle from '@components/page-title/PageTitle';
import { Button, message, Modal } from 'antd';
import { updateProjectInfo } from '@api/BaseAPI';
import useAuth from '@context/auth';
import { setLocalStorage } from '@Utils';
import { PROJECT_KEY } from '@api/APIUtils';

type QuickCreateProps = {
  isFlowCreate?: boolean;
  onSuccess?: Function;
};

export default function QuickCreate(props: QuickCreateProps) {
  const { isFlowCreate, onSuccess } = props;

  const {
    state: { project },
    dispatch,
  } = useAuth();

  const [isEdit, setIsEdit] = useState(false);
  const [formValidate, setFormValidate] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = useState({
    name: '',
    detail: '',
    image: [],
    categoryIds: [''],
  });

  const onDataChange = (curFormData) => {
    setFormData(curFormData);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await updateProjectInfo(
      isEdit ? { ...formData, appId: project.appId } : formData
    );
    const { data } = response;
    if (data.code !== 200) {
      message.error(data.msg);
      setLoading(false);
    } else {
      setLoading(false);
      const curProject = data.data;
      setLocalStorage(PROJECT_KEY, JSON.stringify(curProject));
      dispatch({ type: 'SET_PROJECT', project: curProject });
      if (isFlowCreate) {
        onSuccess();
      } else {
        Modal.success({
          title: '已完成小程序创建',
          className: 'result-modal',
          width: 640,
          okText: '知道了',
          okButtonProps: {
            className: 'saveBtn',
          },
          content: getSuccessContent(curProject),
        });
        navigate('/overview');
      }
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/setting/basic') {
      setIsEdit(true);
      setFormData({
        name: project.name,
        detail: project.detail,
        image: [project.image],
        categoryIds: project.categoryIds,
      });
      setFormValidate(true);
    }
  }, []);

  const getSuccessContent = (project: any) => {
    return (
      <div className="result-content-wrapper">
        <div className="title">
          <i className="icon-success-new"></i>
          <span>已完成小程序创建</span>
        </div>
        <div className="main">AppID：{(project && project.appId) || '-'}</div>
        <div className="tip1">您可以在设置中进行信息更新</div>
        <div className="tip2">在 设置 – 基本设置 中更新小程序信息</div>
        <div className="tip3">
          在 设置 – 开发设置 中查看AppID和密钥，配置服务器域名
        </div>
      </div>
    );
  };

  const onValidateChange = (curFormValidateMap) => {
    let newFormValidate = true;
    for (const key in curFormValidateMap) {
      if (!curFormValidateMap[key]) newFormValidate = false;
    }
    setFormValidate(newFormValidate);
  };

  return (
    <div className={`page-quick-create ${isFlowCreate ? 'flow-create' : ''}`}>
      {isFlowCreate ? null : (
        <PageTitle
          title={isEdit ? '基本设置' : '创建小程序'}
          showBack={!isEdit}
        ></PageTitle>
      )}
      <QuickCreateForm
        onDataChange={onDataChange}
        onValidateChange={onValidateChange}
        formData={formData}
        isEdit={isEdit}
      />
      <div className="footer-wrapper">
        <Button
          loading={loading}
          disabled={!formValidate}
          onClick={handleSubmit}
          className="saveBtn"
        >
          {isFlowCreate ? '下一步' : '保存'}
        </Button>
      </div>
    </div>
  );
}
