import { deleteDeveloper } from '@api/BaseAPI';
import useAuth from '@context/auth';
import { navigate } from '@reach/router';
import {
  Avatar,
  Button,
  Empty,
  message,
  Popconfirm,
  Skeleton,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import ChangeAdmin from './ChangeAdmin';
import DeveloperForm from './DeveloperForm';

import './index.less';

export default function Group() {
  const {
    state: { user },
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState<any>();
  const [developer, setDeveloper] = useState<any>();
  const [members, setMembers] = useState([]);
  const [changeAdminVisible, setChangeAdminVisible] = useState(false);
  const [developerFormVisible, setDevloperFormVisible] = useState(false);

  const requestMemberList = () => {
    setLoading(true);
    // TODO
    const response = {
      code: 200,
      msg: 'success', //若失败，msg为提示信息
      data: {
        admin: {
          nickname: '待联调',
          avatar: 'http://avatar.hitv.com/iT4FqEJ4sIVv9cm6yLI8fogRE1CIqU.jpg',
          mobile: '135****7640',
          addTime: '2020-08-01 12:01:05',
          uuid: 'edd98191fa8c43479df8ef025623125e',
        },
        list: [
          {
            mobile: '135****7640',
            uuid: '111',
            avatar: 'http://avatar.hitv.com/iT4FqEJ4sIVv9cm6yLI8fogRE1CIqU.jpg',
            addTime: '2020-08-01 12:01:05',
            nickname: '待联调',
            markInfo: '待联调', //备注信息
            accessList: [
              {
                //角色权限列表
                type: 'all', //名称   //请求后续接口均需带上type参数！！！
                op: 0, //可操作类型  0-不可见 1-可查看  2-可编辑
              },
              {
                type: 'develop', //名称
                op: 1, //可操作类型  0-不可见 1-可查看  2-可编辑
              },
              {
                type: 'setting', //名称
                op: 2, //可操作类型  0-不可见 1-可查看  2-可编辑
              },
            ],
          },
        ], //多个列表
      },
    };
    setAdmin(response.data.admin);
    setMembers(response.data.list);
    setLoading(false);
  };

  const onEdit = (user: any) => {
    const { mobile, avatar, addTime, markInfo, accessList, nickname } = user;
    const powerObj = {};
    accessList.forEach((item: any) => {
      powerObj[item.type] = item.op;
    });
    setDeveloper({
      mobile,
      nickname,
      avatar,
      addTime,
      markInfo,
      ...powerObj,
    });
    setDevloperFormVisible(true);
  };

  const onDelete = async (user: any) => {
    const response = await deleteDeveloper({
      toUuid: user.uuid,
    });
    const { data } = response;
    if (data.code !== 200) {
      message.error(data.msg);
    } else {
      message.success('删除成功！');
    }
    requestMemberList();
  };

  const onAdd = () => {
    setDevloperFormVisible(true);
    setDeveloper({
      mobile: '',
      markInfo: '',
      nickname: '',
      avatar: '',
      addTime: '',
      all: 0,
      develop: 0,
      setting: 0,
    });
  };

  const onVisibleChange = (type: string, visible: boolean) => {
    if (type === 'changeAdmin') {
      setChangeAdminVisible(visible);
    } else if (type === 'changeDeveloper') {
      setDevloperFormVisible(visible);
    }
  };

  const onBack = () => {
    onVisibleChange('changeAdmin', false);
    onVisibleChange('changeDeveloper', false);
    requestMemberList();
  };

  const getStatus = (accessList: any, key: string) => {
    let curItem = null;
    accessList.forEach((item: any) => {
      if (item.type === key) curItem = { ...item };
    });
    let statusSpan = <span className="none">-</span>;
    if (curItem && curItem.op === 1) {
      statusSpan = <span className="view">查看</span>;
    }
    if (curItem && curItem.op === 2) {
      statusSpan = <span className="edit">编辑</span>;
    }
    return statusSpan;
  };

  const columns = [
    {
      title: '',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 120,
      render: (data: any) => {
        return (
          <div className="avatar-column">
            <Avatar size={40} src={data || ''}></Avatar>
          </div>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'markInfo',
      key: 'markInfo',
      render: (data: any) => {
        return data || '-';
      },
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
      render: (data: any) => {
        return data || '-';
      },
    },
    {
      title: '总览',
      dataIndex: 'accessList',
      key: 'all',
      render: (list) => getStatus(list, 'all'),
    },
    {
      title: '开发',
      dataIndex: 'accessList',
      key: 'develop',
      render: (list) => getStatus(list, 'develop'),
    },
    {
      title: '设置',
      dataIndex: 'accessList',
      key: 'setting',
      render: (list) => getStatus(list, 'setting'),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: 200,
      key: 'user',
      render: (data: any, record: any) => {
        return (
          <div className="operate-column">
            <Button
              className="saveBtn small-size"
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
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
              onConfirm={() => onDelete(record)}
            >
              <Button className="confirmBtn small-size">删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const doChangeAdmin = () => {
    if (user.uuid !== admin.uuid) return;
    onVisibleChange('changeAdmin', true);
  };

  useEffect(() => {
    requestMemberList();
  }, []);

  return (
    <div className="page-group">
      {changeAdminVisible ? (
        <ChangeAdmin admin={admin} onBack={onBack}></ChangeAdmin>
      ) : null}
      {developerFormVisible ? (
        <DeveloperForm developer={developer} onBack={onBack}></DeveloperForm>
      ) : null}
      {!changeAdminVisible && !developerFormVisible ? (
        <>
          <div className="admin-module module-wapper" onClick={doChangeAdmin}>
            <div className="title">管理员</div>
            <div className="info-wapper">
              {loading ? (
                <Skeleton></Skeleton>
              ) : (
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
                      <div className="content">
                        {(admin && admin.mobile) || ''}{' '}
                      </div>
                    </div>
                    <div className="info-item">
                      <div className="label">绑定时间</div>
                      <div className="content">
                        {(admin && admin.addTime) || ''}{' '}
                      </div>
                    </div>
                  </div>
                  {user && admin && user.uuid !== admin.uuid ? null : (
                    <i className="icon-arr-right"></i>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="member-module module-wapper">
            <div className="title">协作者</div>
            <i className="icon-user-add circle-btn" onClick={onAdd}></i>
            <div className="member-list">
              {loading ? (
                <Skeleton></Skeleton>
              ) : (
                <>
                  <Table
                    columns={columns}
                    dataSource={members}
                    pagination={false}
                    rowKey={(record) => record.uuid}
                  />
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
