import { editFramework, getFrameworkList } from '@api/BaseAPI';
import Ellipsis from '@components/ellipsis/Ellipsis';
import FormItem from '@components/form-item';
import Toolbar from '@components/toolbar/Toolbar';
import { addTimeSorter } from '@Utils';
import { Button, message, Modal, Skeleton, Table } from 'antd';
import React, { useEffect, useState } from 'react';

import './index.less';

const AllValue = '';
const AllLabel = '全部';
const VersionPublishValue = 0;
const VersionPublishLabel = '版本发布';
const HotUpdateValue = 1;
const HotUpdateLabel = '热更新';

const statusMap = {
  [VersionPublishValue]: {
    color: 'green',
    label: VersionPublishLabel,
  },
  [HotUpdateValue]: {
    color: 'orange',
    label: HotUpdateLabel,
  },
};

const filterOptions = [
  {
    name: AllLabel,
    value: AllValue,
  },
  {
    name: VersionPublishLabel,
    value: VersionPublishValue,
  },
  {
    name: HotUpdateLabel,
    value: HotUpdateValue,
  },
];

const checkOptions = [
  {
    name: VersionPublishLabel,
    value: VersionPublishValue,
  },
  {
    name: HotUpdateLabel,
    value: HotUpdateValue,
  },
];

export default function Framework() {
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formValidate, setFormValidate] = useState(false);
  const [validateMap, setValidateMap] = useState({
    url: false,
    version: false,
    androidVersion: false,
    iphoneVersion: false,
    content: false,
  });
  const [list, setList] = useState([]);
  const [listInfo, setListInfo] = useState({
    total: 10,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [sorter, setSorter] = useState<any>({
    order: 'descend',
    columnKey: 'updateTime',
  });
  const [filters, setFilters] = useState<any>({
    type: '',
  });

  const [curFormData, setCurFormData] = useState({
    id: '',
    type: 0,
    url: '',
    md5: '',
    version: '',
    androidVersion: '',
    iphoneVersion: '',
    content: '',
  });

  const onSave = async () => {
    const response = await editFramework(curFormData);
    const { code } = response.data;
    if (code === 200) {
      message.success('保存成功！');
      setFormVisible(false);
      requestFrameworkList();
    } else {
      message.error('保存失败，请重试！');
    }
  };

  const onDelete = (info: any) => {};

  const onEdit = (info: any) => {
    const newCurFormData = {
      id: info.id,
      type: info.type,
      url: info.url,
      md5: info.md5,
      version: info.version,
      androidVersion: info.androidVersion,
      iphoneVersion: info.iphoneVersion,
      content: info.content,
    };
    setCurFormData(newCurFormData);
    setValidateMap({
      url: true,
      version: true,
      androidVersion: true,
      iphoneVersion: true,
      content: true,
    });
    setFormValidate(true);
    setFormVisible(true);
  };

  const onAdd = () => {
    setCurFormData({
      id: '',
      type: 0,
      url: '',
      md5: '',
      version: '',
      androidVersion: '',
      iphoneVersion: '',
      content: '',
    });
    setValidateMap({
      url: false,
      version: false,
      androidVersion: false,
      iphoneVersion: false,
      content: false,
    });
    setFormValidate(false);
    setFormVisible(true);
  };

  const destroyModal = () => {
    setFormVisible(false);
  };

  const onFormItemChange = (model: string, value: any) => {
    const newCurFormData = { ...curFormData };
    if (model === 'url') {
      const [url, md5] = value.split('|');
      newCurFormData['url'] = url;
      newCurFormData['md5'] = md5;
    } else {
      newCurFormData[model] = value;
    }
    setCurFormData(newCurFormData);
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

  const onFilterChange = (model, value) => {
    setFilters({
      ...filters,
      [model]: value,
    });
  };

  const handleTableChange = (paginationInfo, filters, sorterInfo) => {
    setPagination(paginationInfo);
    setSorter(sorterInfo);
  };

  const getFormModal = () => {
    return (
      <Modal
        wrapClassName={`form-modal framework-form ${
          !formVisible ? 'hidden' : ''
        }`}
        title=""
        visible
        mask={formVisible}
        closable={false}
        width={640}
      >
        <div className="form-content-wrapper">
          <div className="title">框架文件管理</div>
          {formVisible ? (
            <div className="form-list">
              <FormItem
                params={{
                  model: 'type',
                  label: '发布类型',
                  required: true,
                  type: 'radio',
                  options: checkOptions,
                  value: curFormData.type,
                }}
                onChange={(value: any) => onFormItemChange('type', value)}
              />
              <FormItem
                params={{
                  model: 'version',
                  label: '版本',
                  required: true,
                  value: curFormData.version,
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
                  model: 'androidVersion',
                  label: '支持Android最低版本',
                  required: true,
                  value: curFormData.androidVersion,
                  customValidate: {
                    fn: (value: any) => {
                      return /^(([0-9]|([1-9]([0-9]*))).){2}([0-9]|([1-9]([0-9]*)))([-](([0-9A-Za-z]|([1-9A-Za-z]([0-9A-Za-z]*)))[.]){0,}([0-9A-Za-z]|([1-9A-Za-z]([0-9A-Za-z]*)))){0,1}([+](([0-9A-Za-z]{1,})[.]){0,}([0-9A-Za-z]{1,})){0,1}$/.test(
                        value
                      );
                    },
                    errorMsg: '版本格式错误',
                  },
                }}
                onChange={(value: any) =>
                  onFormItemChange('androidVersion', value)
                }
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('androidVersion', validate)
                }
              />
              <FormItem
                params={{
                  model: 'iphoneVersion',
                  label: '支持iOS最低版本',
                  required: true,
                  value: curFormData.iphoneVersion,
                  customValidate: {
                    fn: (value: any) => {
                      return /^(([0-9]|([1-9]([0-9]*))).){2}([0-9]|([1-9]([0-9]*)))([-](([0-9A-Za-z]|([1-9A-Za-z]([0-9A-Za-z]*)))[.]){0,}([0-9A-Za-z]|([1-9A-Za-z]([0-9A-Za-z]*)))){0,1}([+](([0-9A-Za-z]{1,})[.]){0,}([0-9A-Za-z]{1,})){0,1}$/.test(
                        value
                      );
                    },
                    errorMsg: '版本格式错误',
                  },
                }}
                onChange={(value: any) =>
                  onFormItemChange('iphoneVersion', value)
                }
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('iphoneVersion', validate)
                }
              />
              <FormItem
                params={{
                  model: 'content',
                  label: '更新内容',
                  required: true,
                  type: 'textarea',
                  value: curFormData.content,
                }}
                onChange={(value: any) => onFormItemChange('content', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('content', validate)
                }
              />
              <FormItem
                params={{
                  model: 'url',
                  label: '框架文件',
                  required: true,
                  type: 'file',
                  fileType: 'fw',
                  value: curFormData.url,
                }}
                onChange={(value: any) => onFormItemChange('url', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('url', validate)
                }
              />
            </div>
          ) : null}
          <div className="buttons">
            <Button
              className="saveBtn middle-size"
              disabled={!formValidate}
              onClick={onSave}
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

  const downloadFile = (url: string) => {
    window.open(url);
  };

  const requestFrameworkList = async () => {
    setLoading(true);
    const response = await getFrameworkList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      orderBy: sorter.columnKey,
      status: filters.status,
      orderType: sorter.order === 'descend' ? 'desc' : 'asc',
    });
    const { data } = response.data;
    setListInfo({
      ...listInfo,
      total: data.total,
    });
    setList(data.list);
    setLoading(false);
  };

  const columns = [
    {
      title: ' 序号 ',
      render: (text, record, index) =>
        `${(pagination.current - 1) * pagination.pageSize + (index + 1)}`,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (data: any) => <Ellipsis width={50} content={data} />,
    },
    {
      title: '发布类型',
      dataIndex: 'type',
      key: 'type',
      render: (data: any) => {
        const { label, color } = statusMap[data];
        return <span className={`status-label ${color}`}>{label || '-'}</span>;
      },
    },
    {
      title: '下载地址',
      dataIndex: 'url',
      key: 'url',
      render: (data: any) => (
        <span className="link" onClick={() => downloadFile(data)}>
          <Ellipsis width={400} content={data} />
        </span>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: addTimeSorter,
      sortOrder: sorter && sorter.columnKey === 'updateTime' && sorter.order,
      render: (data: any) => <Ellipsis width={150} content={data} />,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (data: any, record: any) => {
        return (
          <div className="operate-column">
            <Button
              className="saveBtn no-shadow small-size"
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
            <Button
              className="confirmBtn no-shadow small-size"
              onClick={() => onDelete(record)}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    requestFrameworkList();
  }, [pagination, sorter, filters]);

  const filtersConfig = [
    {
      label: '发布类型',
      type: 'selector',
      model: 'type',
      options: filterOptions,
      value: filters.type,
    },
  ];

  const buttonsConfig = [
    {
      label: '新增',
      className: 'saveBtn no-shadow',
      icon: 'icon-add-new',
      onClick: onAdd,
    },
  ];

  return (
    <div className="page-framework">
      <div className="table-wapper">
        {loading ? (
          <Skeleton></Skeleton>
        ) : (
          <>
            <Toolbar
              filters={filtersConfig}
              onFilterChange={onFilterChange}
              buttons={buttonsConfig}
            />
            <Table
              columns={columns}
              dataSource={list}
              pagination={{
                ...pagination,
                total: listInfo.total,
              }}
              onChange={handleTableChange}
              rowKey={(record) => record.id}
            />
          </>
        )}
      </div>
      {getFormModal()}
    </div>
  );
}
