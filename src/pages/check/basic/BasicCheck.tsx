import { basicCheck, getBasicCheckList } from '@api/BaseAPI';
import Ellipsis from '@components/ellipsis/Ellipsis';
import FormItem from '@components/form-item';
import Toolbar from '@components/toolbar/Toolbar';
import { addTimeSorter } from '@Utils';
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Skeleton,
  Table,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';

import './index.less';

const AllValue = '';
const AllLabel = '全部';
const WaitValue = 1;
const WaitLabel = '待审核';
const PassValue = 2;
const PassLabel = '审核通过';
const RefuseValue = 3;
const RefuseLabel = '审核失败';

const statusMap = {
  [WaitValue]: {
    color: 'orange',
    label: WaitLabel,
  },
  [PassValue]: {
    color: 'green',
    label: PassLabel,
  },
  [RefuseValue]: {
    color: 'red',
    label: RefuseLabel,
  },
};

const filterOptions = [
  {
    name: AllLabel,
    value: AllValue,
  },
  {
    name: WaitLabel,
    value: WaitValue,
  },
  {
    name: PassLabel,
    value: PassValue,
  },
  {
    name: RefuseLabel,
    value: RefuseValue,
  },
];

const checkOptions = [
  {
    name: PassLabel,
    value: PassValue,
  },
  {
    name: RefuseLabel,
    value: RefuseValue,
  },
];

export default function BasicCheck() {
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [reasonValidate, setReasonValidate] = useState(true);
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
    columnKey: 'addTime',
  });
  const [filters, setFilters] = useState<any>({
    status: '',
  });

  const [curFormData, setCurFormData] = useState({
    id: '',
    status: 2,
    auditReason: '',
    auditVersion: '',
  });

  const filtersConfig = [
    {
      label: '状态',
      type: 'selector',
      model: 'status',
      options: filterOptions,
      value: filters.status,
    },
  ];

  const onCheck = async () => {
    const response = await basicCheck(curFormData);
    const { code } = response.data;
    if (code === 200) {
      message.success('审核成功！');
      setFormVisible(false);
      requestAuthCheckList();
    } else {
      message.error('审核失败，请重试！');
    }
  };

  const onPreview = (info: any) => {
    const newCurFormData = {
      id: info.id,
      status: info.status === WaitValue ? PassValue : info.status,
      auditReason: '',
      auditVersion: info.auditVersion,
    };
    setCurFormData(newCurFormData);
    setReasonValidate(info.status !== RefuseValue);
    setFormVisible(true);
  };

  const destroyModal = () => {
    setFormVisible(false);
  };

  const onFormItemChange = (model: string, value: any) => {
    const newCurFormData = { ...curFormData };
    newCurFormData[model] = value;
    if (model === 'status') {
      if (value === PassValue) {
        setReasonValidate(true);
      } else {
        setReasonValidate(!!newCurFormData.auditReason);
      }
    }
    setCurFormData(newCurFormData);
  };

  const onFormItemValidChange = (model: string, validate: boolean) => {
    if (validate !== reasonValidate) setReasonValidate(validate);
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
        wrapClassName={`form-modal ${!formVisible ? 'hidden' : ''}`}
        title=""
        visible
        mask={formVisible}
        closable={false}
        width={640}
      >
        <div className="form-content-wrapper">
          <div className="title">身份审核</div>
          {formVisible ? (
            <div className="form-list">
              <FormItem
                params={{
                  model: 'status',
                  label: '审核意见',
                  required: true,
                  type: 'radio',
                  options: checkOptions,
                  value: curFormData.status,
                }}
                onChange={(value: any) => onFormItemChange('status', value)}
              />
              <FormItem
                params={{
                  model: 'auditReason',
                  label: '拒绝原因',
                  className: curFormData.status === PassValue ? 'hidden' : '',
                  required: curFormData.status === RefuseValue,
                  value: curFormData.auditReason,
                }}
                onChange={(value: any) =>
                  onFormItemChange('auditReason', value)
                }
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('auditReason', validate)
                }
              />
            </div>
          ) : null}
          <div className="buttons">
            <Button
              className="saveBtn middle-size"
              disabled={!reasonValidate}
              onClick={onCheck}
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

  const requestAuthCheckList = async () => {
    setLoading(true);
    const response = await getBasicCheckList({
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

  // addTime: "2021-03-04 11:19:07.0"
  // auditName: "昵称优先显示"
  // auditUuid: "190df091ab9b45dbb429687f4a7d1bff"
  // auditVersion: 1614827947
  // certType: 0
  // id: 4
  // name: "31"
  // status: 2
  const columns = [
    {
      title: ' 序号 ',
      render: (text, record, index) =>
        `${(pagination.current - 1) * pagination.pageSize + (index + 1)}`,
    },
    {
      title: '小程序名称',
      dataIndex: 'name',
      key: 'name',
      render: (data: any) => <Ellipsis width={100} content={data} />,
    },
    {
      title: '小程序简介',
      dataIndex: 'detail',
      key: 'detail',
      render: (data: any) => <Ellipsis content={data} />,
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (data: any) => <Ellipsis width={100} content={data} />,
    },
    {
      title: '审核者',
      dataIndex: 'auditName',
      key: 'auditName',
      render: (data: any) => <Ellipsis width={100} content={data} />,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      key: 'status',
      render: (data: any) => {
        const { label, color } = statusMap[data];
        return <span className={`status-label ${color}`}>{label || '-'}</span>;
      },
    },
    {
      title: '操作时间',
      dataIndex: 'addTime',
      key: 'addTime',
      sorter: addTimeSorter,
      sortOrder: sorter && sorter.columnKey === 'addTime' && sorter.order,
      render: (data: any) => <Ellipsis content={data} />,
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
              onClick={() => onPreview(record)}
            >
              审核
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    requestAuthCheckList();
  }, [pagination, sorter, filters]);

  return (
    <div className="page-dev-setting">
      <div className="domain-list">
        {loading ? (
          <Skeleton></Skeleton>
        ) : (
          <>
            <Toolbar filters={filtersConfig} onFilterChange={onFilterChange} />
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
