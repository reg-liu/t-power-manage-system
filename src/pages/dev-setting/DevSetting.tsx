import {
  addDomain,
  deleteDomain,
  getAppSecret,
  getDevSettings,
} from '@api/BaseAPI';
import FormItem from '@components/form-item';
import PageTitle from '@components/page-title/PageTitle';
import useAuth from '@context/auth';
import {
  Button,
  Empty,
  message,
  Modal,
  Popconfirm,
  Skeleton,
  Table,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './index.less';

export default function DevSetting() {
  const {
    state: { project },
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [domainList, setDomainList] = useState([]);
  const [curFormData, setCurFormData] = useState({
    domain: '',
    appId: project.appId,
  });
  const [formVisible, setFormVisible] = useState(false);
  const [curDomainValidate, setCurDomainValidate] = useState(false);
  const [checkFileLink, setCheckFileLink] = useState('');
  const [oldAppSecret, setOldAppSecret] = useState('');

  const doCopy = () => {
    message.success('已复制到粘贴板！');
  };

  const onAdd = () => {
    if (domainList.length === 5) {
      message.error('最多只能添加 5 条服务器域名白名单');
    } else {
      setFormVisible(true);
    }
  };

  const onAddConfirm = async () => {
    const response = await addDomain(curFormData);
    const { code } = response.data;
    if (code === 200) {
      message.success('添加服务器域名白名单成功！');
      setFormVisible(false);
      setCurFormData({
        ...curFormData,
        domain: '',
      });
      requestDevSettingData();
    } else {
      message.error('添加失败，请重试！');
    }
  };

  const onDelete = async (id: any) => {
    await deleteDomain({
      id,
      appId: project.appId,
    });
    requestDevSettingData();
  };

  const onResetAppSecret = async () => {
    const response = await getAppSecret();
    const { data } = response.data;
    Modal.success({
      title: '密钥已生成',
      className: 'result-modal',
      width: 640,
      okText: '知道了',
      okButtonProps: {
        className: 'saveBtn',
      },
      content: getSuccessContent(data.appSecret),
    });
  };

  const getSuccessContent = (appSecret: any) => {
    return (
      <div className="result-content-wrapper">
        <div className="title">
          <i className="icon-success-new"></i>
          <span>密钥已生成</span>
        </div>
        <div className="main">
          <span>{appSecret || '-'}</span>
        </div>
        <div className="sub">
          <CopyToClipboard text={appSecret}>
            <a className="link" onClick={() => doCopy()}>
              点击复制
            </a>
          </CopyToClipboard>
        </div>
      </div>
    );
  };

  const destroyModal = () => {
    setFormVisible(false);
  };

  const onFormItemChange = (model: string, value: any) => {
    const newCurFormData = { ...curFormData };
    newCurFormData[model] = value;
    setCurFormData(newCurFormData);
  };

  const getFormModal = () => {
    return (
      <Modal
        wrapClassName={`form-modal ${!formVisible ? 'hidden' : ''}`}
        title=""
        visible
        mask={formVisible}
        closable={false}
        width={640}
      >
        <div className="form-content-wrapper">
          <div className="title">服务器域名白名单</div>
          {formVisible ? (
            <div className="form-list">
              <FormItem
                params={{
                  model: 'domain',
                  label: 'https://',
                  required: true,
                  value: curFormData.domain,
                  bottomTip:
                    '请填写域名，示例：example.com，仅支持https协议，非https协议请升级，否则调用会被拦截',
                  customValidate: {
                    fn: (value: any) => {
                      return /^(http[s]{0,1}?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(
                        `https://${value}`
                      );
                    },
                    errorMsg: '域名格式有误',
                  },
                }}
                onChange={(value: any) => onFormItemChange('domain', value)}
                onFormItemValidChange={(validate: boolean) =>
                  setCurDomainValidate(validate)
                }
              />
            </div>
          ) : null}
          <div className="buttons">
            <Button
              className="saveBtn middle-size"
              disabled={!curDomainValidate}
              onClick={onAddConfirm}
            >
              确认
            </Button>
            <Button className="cancelBtn middle-size" onClick={destroyModal}>
              取消
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const downloadFile = () => {
    if (checkFileLink) window.open(checkFileLink);
  };

  const requestDevSettingData = async () => {
    setLoading(true);
    const response = await getDevSettings();
    const { data } = response.data;
    setOldAppSecret(data.appSecret);
    setCheckFileLink(data.file);
    setDomainList(data.domainList);
    setLoading(false);
  };

  const columns = [
    {
      title: '域名',
      dataIndex: 'domain',
      key: 'domain',
      render: (data: any) => {
        return data || '';
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: 300,
      render: (data: any) => {
        return (
          <div className="operate-column">
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
              onConfirm={() => onDelete(data)}
            >
              <Button className="confirmBtn small-size">删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    requestDevSettingData();
  }, []);

  return (
    <div className="page-dev-setting">
      <PageTitle title="开发设置"></PageTitle>
      <div className="key-module module-wapper">
        <div className="title">小程序Key</div>
        <div className="key-wapper">
          <div className="key-item">
            <div className="label">AppID</div>
            <div className="content">
              {project.appId}
              <CopyToClipboard text={project.appId}>
                <a className="link" onClick={() => doCopy()}>
                  点击复制
                </a>
              </CopyToClipboard>
            </div>
          </div>
          <div className="key-item">
            <div className="label">AppSecret</div>
            <div className="content">
              {oldAppSecret ? (
                <>
                  <Button
                    className="saveBtn middle-size"
                    onClick={onResetAppSecret}
                  >
                    重置密钥
                  </Button>
                  <Tooltip
                    title="出于安全考虑，AppSecret不再被明文保存，忘记密钥请点击重置"
                    placement="bottom"
                  >
                    <i className="icon-help"></i>
                  </Tooltip>
                </>
              ) : (
                <Button
                  className="saveBtn middle-size"
                  onClick={onResetAppSecret}
                >
                  生成密钥
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="domain-module module-wapper">
        <div className="title">
          服务器域名白名单
          <div className="file-download-wrapper">
            <Button className="saveBtn middle-size" onClick={downloadFile}>
              下载验证文件
            </Button>
            <Tooltip
              title="下载域名检验文件，用于第三方平台设置业务域名时使用"
              placement="bottom"
            >
              <i className="icon-help"></i>
            </Tooltip>
          </div>
        </div>
        <i className="icon-add-new circle-btn" onClick={onAdd}></i>
        <div className="domain-list">
          {loading ? (
            <Skeleton></Skeleton>
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={domainList}
                pagination={false}
                rowKey={(record) => record.domain}
              />
            </>
          )}
        </div>
      </div>
      {getFormModal()}
    </div>
  );
}
