import React, { useEffect, useState } from 'react';
import './index.less';
import useAuth from '@context/auth';
import {
  cancelCheck,
  getVersionList,
  offline,
  online,
  submitCheck,
  uploadCode,
} from '@api/BaseAPI';
import QRCode from 'qrcode.react';
import { Button, message, Modal, Popconfirm, Skeleton, Tooltip } from 'antd';
import { getProjectStatus } from '@Utils';
import {
  ProjectBasicReviewFail,
  ProjectBasicReviewing,
  ProjectBasicReviewSuccess,
  ProjectOnline,
  ProjectPublishFail,
  ProjectPublishReviewing,
  ProjectUploaded,
} from '@config';
import FormItem from '@components/form-item';

type AuthProps = {
  isFlowCreate?: boolean;
};

const changeStatusTypes = {
  check: {
    name: '提交审核',
    value: 1,
  },
  publish: {
    name: '发布',
    value: 2,
  },
  delete: {
    name: '删除',
    value: 3,
  },
  online: {
    name: '上线',
    value: 4,
  },
  offline: {
    name: '下架',
    value: 5,
  },
};

export default function VersionManage(props: AuthProps) {
  const {
    state: { user, project },
  } = useAuth();

  const { isFlowCreate } = props;

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    version: '',
    priority: 1,
    md5: '',
    packageUrl: '',
    half: 1,
    vid: '',
    info: '',
    appId: project && project.appId,
  });
  const [validateMap, setValidateMap] = React.useState({
    version: false,
    vid: false,
  });
  const [formValidate, setFormValidate] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [onlineInfo, setOnlineInfo] = useState(null);
  const [checkInfo, setCheckInfo] = useState(null);
  const [devInfoList, setDevInfoList] = useState([]);

  const onAdd = () => {
    setFormVisible(true);
    setUploadFormData({
      version: '',
      priority: 1,
      md5: '',
      packageUrl: '',
      half: 1,
      vid: '',
      info: '',
      appId: project && project.appId,
    });
    setValidateMap({
      version: false,
      vid: false,
    });
    setFormValidate(false);
  };

  const onFormItemChange = (model: string, value: any) => {
    const newCurFormData = { ...uploadFormData };
    if (model === 'packageUrl') {
      const [packageUrl, md5] = value.split('|');
      newCurFormData['packageUrl'] = packageUrl;
      newCurFormData['md5'] = md5;
    } else {
      newCurFormData[model] = value;
    }
    newCurFormData.info = `half=${newCurFormData.half ? 'true' : 'false'}&vid=${
      newCurFormData.vid
    }`;
    setUploadFormData(newCurFormData);
  };

  const onFormItemValidChange = (model: string, validate: boolean) => {
    const newValidateMap = { ...validateMap };
    newValidateMap[model] = validate;
    setValidateMap(newValidateMap);
    let newFormValidate = true;
    for (const key in newValidateMap) {
      if (!newValidateMap[key]) newFormValidate = false;
    }
    setFormValidate(newFormValidate);
  };

  const onAddConfirm = async () => {
    if (!formValidate) return;
    setFormLoading(true);
    const response = await uploadCode(uploadFormData);
    const { code } = response.data;
    setFormLoading(false);
    if (code === 200) {
      message.success('添加成功！');
      setFormVisible(false);
      requestVersionList();
    } else {
      message.error('添加失败，请检查表单信息是否正确！');
    }
  };

  const destroyModal = () => {
    setFormVisible(false);
  };

  const formatInfo = (info: string) => {
    const infoObj = {
      vid: '',
      half: true,
    };
    const params = info.split('&');
    if (params.length !== 2) return null;
    params.forEach((item: string) => {
      const part = item.split('=');
      if (part.length !== 2) return null;
      const [key, value] = part;
      if (key !== 'half' && key !== 'vid') {
        return null;
      } else if (key === 'half') {
        infoObj.half = value === 'true';
      } else if (key === 'vid') {
        infoObj.vid = value;
      }
    });
    return infoObj;
  };

  const formatList = (list: any[]) => {
    const newDevList = [];
    let newCheckInfo = null;
    let newOnlineInfo = null;
    list.forEach((item: any) => {
      const { id, version, addTime, info, mark } = item;
      const halfVidInfo = formatInfo(info);
      const schema = `imgotv://miniapp?half=${
        halfVidInfo && halfVidInfo.half ? 'true' : ''
      }&vid=${(halfVidInfo && halfVidInfo.vid) || ''}&appid=${
        project && project.appId
      }&appversion=${version}&path=`;
      if (item.status === 0) {
        newDevList.push({
          id,
          version,
          addTime,
          schema,
          info,
          user: item.user.nickname,
          status: ProjectUploaded,
        });
      } else if (item.status === 1 || item.status === 2 || item.status === 3) {
        let formatStatus = ProjectBasicReviewing;
        if (item.status === 2) formatStatus = ProjectBasicReviewSuccess;
        if (item.status === 3) formatStatus = ProjectBasicReviewFail;
        newCheckInfo = {
          id,
          version,
          addTime,
          schema,
          info,
          mark,
          user: item.user.nickname,
          status: formatStatus,
        };
      } else if (item.status === 6) {
        const formatStatus = ProjectOnline;
        newOnlineInfo = {
          id,
          version,
          addTime,
          schema,
          info,
          mark,
          user: item.user.nickname,
          status: formatStatus,
        };
      }
    });
    setDevInfoList(newDevList);
    setCheckInfo(newCheckInfo);
    setOnlineInfo(newOnlineInfo);
  };

  const requestVersionList = async () => {
    setLoading(true);
    const response: any = await getVersionList();
    const { list } = response.data.data;
    formatList(list);
    setLoading(false);
  };

  const isAuthed = () => {
    if (user.isCert) {
      Modal.error({
        title: '',
        className: 'result-modal',
        width: 640,
        okText: '知道了',
        okButtonProps: {
          className: 'saveBtn',
        },
        content: getResultContent(),
      });
      return false;
    } else {
      return true;
    }
  };

  const getResultContent = () => {
    return (
      <div className="result-content-wrapper">
        <div className="title">
          <i className="icon-alert-new"></i>
          <span>请先完成身份认证，再进行审核/发布上线操作</span>
        </div>
        <div className="main">
          <a className="link" href="/auth" target="_self">
            立即认证
          </a>
        </div>
      </div>
    );
  };

  const changeStatus = async (id: string, type: number) => {
    let response;
    if (type === changeStatusTypes.check.value) {
      if (!isAuthed()) return;
      response = await submitCheck(id);
    } else if (type === changeStatusTypes.delete.value) {
      response = await cancelCheck(id);
    } else if (type === changeStatusTypes.online.value) {
      response = await online(id);
    } else if (type === changeStatusTypes.offline.value) {
      response = await offline(id);
    }
    const { code, msg } = response.data;
    if (code === 200) {
      message.success('操作成功！');
      requestVersionList();
    } else {
      message.error(msg);
    }
  };

  const getVersionContent = (project: any) => {
    return (
      <div className="content">
        <div className="qr-wrapper">
          <div className="qr-code">
            <QRCode value={project.schema} size={102} />
          </div>
          <div className="preview-tip">预览小程序</div>
        </div>
        <div className="info-wrapper">
          <div className="content-item">
            <div className="label">版本：</div>
            <div className="value">{project.version}</div>
          </div>
          <div className="content-item">
            <div className="label">状态：</div>
            <div className="value">
              {getProjectStatus(project.status, project.mark)}
            </div>
          </div>
          <div className="content-item">
            <div className="label">提交者：</div>
            <div className="value">{project.user}</div>
          </div>
          <div className="content-item">
            <div className="label">提交时间：</div>
            <div className="value">{project.addTime}</div>
          </div>
        </div>
      </div>
    );
  };

  const getFormModal = () => {
    return (
      <Modal
        wrapClassName={`form-modal code-upload-form ${
          !formVisible ? 'hidden' : ''
        }`}
        title=""
        visible
        mask={formVisible}
        closable={false}
        width={640}
      >
        <div className="form-content-wrapper">
          <div className="title">上传代码</div>
          {formVisible ? (
            <div className="form-list">
              <FormItem
                params={{
                  model: 'half',
                  label: '小程序类型',
                  required: true,
                  type: 'radio',
                  options: [
                    {
                      value: 0,
                      name: '全屏小程序',
                    },
                    {
                      value: 1,
                      name: '半屏小程序',
                    },
                  ],
                  value: uploadFormData.half,
                }}
                onChange={(value: any) => onFormItemChange('half', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('half', validate)
                }
              />
              <FormItem
                params={{
                  model: 'vid',
                  label: 'Vid',
                  required: true,
                  value: uploadFormData.vid,
                }}
                onChange={(value: any) => onFormItemChange('vid', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('vid', validate)
                }
              />
              <FormItem
                params={{
                  model: 'version',
                  label: '版本',
                  required: true,
                  value: uploadFormData.version,
                  customValidate: {
                    fn: (value: any) => {
                      return /^(([0-9]|([1-9]([0-9]*))).){2}([0-9]|([1-9]([0-9]*)))([-](([0-9A-Za-z]|([1-9A-Za-z]([0-9A-Za-z]*)))[.]){0,}([0-9A-Za-z]|([1-9A-Za-z]([0-9A-Za-z]*)))){0,1}([+](([0-9A-Za-z]{1,})[.]){0,}([0-9A-Za-z]{1,})){0,1}$/.test(
                        value
                      );
                    },
                    errorMsg: '版本格式错误',
                  },
                }}
                onChange={(value: any) => onFormItemChange('version', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('version', validate)
                }
              />
              <FormItem
                params={{
                  model: 'packageUrl',
                  label: '代码压缩包',
                  required: true,
                  type: 'file',
                  fileType: 'zip',
                  value: uploadFormData.packageUrl,
                }}
                onChange={(value: any) => onFormItemChange('packageUrl', value)}
              />
            </div>
          ) : null}
          <div className="buttons">
            <Button
              className="saveBtn middle-size"
              disabled={!formValidate}
              loading={formLoading}
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

  useEffect(() => {
    requestVersionList();
  }, []);

  return (
    <div className={`page-version ${isFlowCreate ? 'flow-create' : ''}`}>
      {
        <>
          <div className="title-wrapper">
            <Tooltip title="上传代码">
              <i className="circle-btn icon-add-new" onClick={onAdd}></i>
            </Tooltip>
            <div className="title">版本管理</div>
            <div className="desc">
              线上版本和审核版本都只能同时存在一个，开发版本每个用户只能同时存在一个
            </div>
          </div>
          {loading ? (
            <Skeleton />
          ) : (
            <div className="version-list-wrapper">
              <div className="online-wrapper">
                {onlineInfo ? (
                  <div className="version-content">
                    <div className="header">
                      <div className="title">线上版本</div>
                      <div className="buttons">
                        <Popconfirm
                          title="确认执行此操作?"
                          cancelText="取消"
                          okText="确定"
                          okButtonProps={{
                            className: 'saveBtn small-size',
                          }}
                          cancelButtonProps={{
                            className: 'cancelBtn small-size',
                          }}
                          onConfirm={() =>
                            changeStatus(
                              onlineInfo.id,
                              onlineInfo.status === ProjectPublishFail
                                ? changeStatusTypes.delete.value
                                : changeStatusTypes.offline.value
                            )
                          }
                        >
                          <Button className="confirmBtn no-shadow middle-size">
                            {onlineInfo.status === ProjectPublishFail
                              ? '删除'
                              : changeStatusTypes.offline.name}
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                    {getVersionContent(onlineInfo)}
                  </div>
                ) : (
                  <div className="version-content">
                    <div className="header">
                      <div className="title">线上版本</div>
                      <div className="empty-text">暂无线上版本</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="check-wrapper">
                {checkInfo ? (
                  <div className="version-content">
                    <div className="header">
                      <div className="title">审核版本</div>
                      <div className="buttons">
                        {checkInfo.status === ProjectBasicReviewSuccess ? (
                          <Button
                            className="saveBtn no-shadow middle-size"
                            onClick={() =>
                              changeStatus(
                                checkInfo.id,
                                changeStatusTypes.online.value
                              )
                            }
                          >
                            {changeStatusTypes.online.name}
                          </Button>
                        ) : null}
                        <Popconfirm
                          title="确认执行此操作?"
                          cancelText="取消"
                          okText="确定"
                          okButtonProps={{
                            className: 'saveBtn small-size',
                          }}
                          cancelButtonProps={{
                            className: 'cancelBtn small-size',
                          }}
                          onConfirm={() =>
                            changeStatus(
                              checkInfo.id,
                              changeStatusTypes.delete.value
                            )
                          }
                        >
                          <Button className="confirmBtn no-shadow middle-size">
                            {changeStatusTypes.delete.name}
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                    {getVersionContent(checkInfo)}
                  </div>
                ) : (
                  <div className="version-content">
                    <div className="header">
                      <div className="title">审核版本</div>
                      <div className="empty-text">暂无审核版本</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="dev-wrapper">
                {devInfoList.length ? (
                  <>
                    {devInfoList.map((devInfo: any) => {
                      return (
                        <div className="version-content" key={devInfo.id}>
                          <div className="header">
                            <div className="title">开发版本</div>
                            <div className="buttons">
                              <Button
                                className="saveBtn no-shadow middle-size"
                                onClick={() =>
                                  changeStatus(
                                    devInfo.id,
                                    changeStatusTypes.check.value
                                  )
                                }
                              >
                                {changeStatusTypes.check.name}
                              </Button>
                              <Popconfirm
                                title="确认执行此操作?"
                                cancelText="取消"
                                okText="确定"
                                okButtonProps={{
                                  className: 'saveBtn small-size',
                                }}
                                cancelButtonProps={{
                                  className: 'cancelBtn small-size',
                                }}
                                onConfirm={() =>
                                  changeStatus(
                                    checkInfo.id,
                                    changeStatusTypes.delete.value
                                  )
                                }
                              >
                                <Button className="confirmBtn no-shadow middle-size">
                                  {changeStatusTypes.delete.name}
                                </Button>
                              </Popconfirm>
                            </div>
                          </div>
                          {getVersionContent(devInfo)}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="version-content">
                    <div className="header">
                      <div className="title">开发版本</div>
                      <div className="empty-text">
                        暂无开发版本，请在
                        <a
                          className="link"
                          href="http://open.imgo.tv/doc/develop/tool/desc"
                          target="_blank"
                        >
                          开发者工具
                        </a>
                        开发并上传代码包
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      }
      {getFormModal()}
    </div>
  );
}
