import { editDevTool, getDevToolList } from '@api/BaseAPI';
import Ellipsis from '@components/ellipsis/Ellipsis';
import FormItem from '@components/form-item';
import Toolbar from '@components/toolbar/Toolbar';
import { addTimeSorter } from '@Utils';
import { Button, message, Modal, Skeleton, Table } from 'antd';
import React, { useEffect, useState } from 'react';

import './index.less';

export default function DevTool() {
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formValidate, setFormValidate] = useState(false);
  const [curFormData, setCurFormData] = useState({
    id: '',
    macUrl: '',
    macMd5: '',
    windowsUrl: '',
    windowsMd5: '',
    version: '',
    content: '',
  });
  const [validateMap, setValidateMap] = useState({
    macUrl: false,
    version: false,
    windowsUrl: false,
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

  const onSave = async () => {
    const response = await editDevTool(curFormData);
    const { code } = response.data;
    if (code === 200) {
      message.success('保存成功！');
      setFormVisible(false);
      requestDevToolList();
    } else {
      message.error('保存失败，请重试！');
    }
  };

  const onDelete = (info: any) => {};

  const onEdit = (info: any) => {
    const newCurFormData = {
      id: info.id,
      macUrl: info.macUrl,
      macMd5: info.macMd5,
      windowsUrl: info.windowsUrl,
      windowsMd5: info.windowsMd5,
      version: info.version,
      content: info.content,
    };
    setCurFormData(newCurFormData);
    setValidateMap({
      macUrl: true,
      version: true,
      windowsUrl: true,
      content: true,
    });
    setFormValidate(true);
    setFormVisible(true);
  };

  const onAdd = () => {
    setCurFormData({
      id: '',
      macUrl: '',
      macMd5: '',
      windowsUrl: '',
      windowsMd5: '',
      version: '',
      content: '',
    });
    setValidateMap({
      macUrl: false,
      version: false,
      windowsUrl: false,
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
    if (model === 'macUrl') {
      const [url, md5] = value.split('|');
      newCurFormData['macUrl'] = url;
      newCurFormData['macMd5'] = md5;
    }
    if (model === 'windowsUrl') {
      const [url, md5] = value.split('|');
      newCurFormData['windowsUrl'] = url;
      newCurFormData['windowsMd5'] = md5;
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
        wrapClassName={`form-modal dev-tool-form ${
          !formVisible ? 'hidden' : ''
        }`}
        title=""
        visible
        mask={formVisible}
        closable={false}
        width={640}
      >
        <div className="form-content-wrapper">
          <div className="title">开发者工具管理</div>
          {formVisible ? (
            <div className="form-list">
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
                  model: 'macUrl',
                  label: 'Mac安装文件',
                  required: true,
                  type: 'file',
                  fileType: 'dmg',
                  value: curFormData.macUrl,
                }}
                onChange={(value: any) => onFormItemChange('macUrl', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('macUrl', validate)
                }
              />
              <FormItem
                params={{
                  model: 'windowsUrl',
                  label: 'Windows安装文件',
                  required: true,
                  type: 'file',
                  fileType: 'exe',
                  value: curFormData.windowsUrl,
                }}
                onChange={(value: any) => onFormItemChange('windowsUrl', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('windowsUrl', validate)
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

  const requestDevToolList = async () => {
    setLoading(true);
    const response = await getDevToolList({
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
      title: 'Mac安装文件',
      dataIndex: 'macUrl',
      key: 'macUrl',
      render: (data: any) => (
        <span className="link" onClick={() => downloadFile(data)}>
          <Ellipsis width={400} content={data} />
        </span>
      ),
    },
    {
      title: 'Windows安装文件',
      dataIndex: 'windowsUrl',
      key: 'windowsUrl',
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
    //requestDevToolList();
  }, [pagination, sorter, filters]);

  const buttonsConfig = [
    {
      label: '新增',
      className: 'saveBtn no-shadow',
      icon: 'icon-add-new',
      onClick: onAdd,
    },
  ];

  return (
    <div className="page-dev-tool">
      <div className="table-wapper">
        {loading ? (
          <Skeleton></Skeleton>
        ) : (
          <>
            <Toolbar onFilterChange={onFilterChange} buttons={buttonsConfig} />
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
