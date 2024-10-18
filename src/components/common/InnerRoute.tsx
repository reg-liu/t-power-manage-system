import React, { useEffect, useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import Header from '@components/header/Header';
import dayjs from 'dayjs';
import Nav from '@components/nav/Nav';
import { Avatar, Button, Popover, Tooltip } from 'antd';
import { getProjectList } from '@api/BaseAPI';
import useAuth from '@context/auth';
import { getLocalStorageValue, setLocalStorage } from '@Utils';
import QRCode from 'qrcode.react';
import { PROJECT_KEY } from '@api/APIUtils';
interface InnerRouteProps extends RouteComponentProps {
  as: React.ElementType<any>;
}

export default function InnerRoute({ as: Comp, ...props }: InnerRouteProps) {
  const {
    state: { project },
    dispatch,
  } = useAuth();

  const [list, setList] = useState([]);

  const [listVisible, setListVisible] = useState(false);

  const onAdd = () => {
    navigate('/quick-create');
  };

  const requestProjectList = async () => {
    const response: any = await getProjectList();
    const { list } = response.data.data;
    dispatch({ type: 'SET_PROJECTS', projects: list });
    setList(list);
  };

  const changeProject = (item: any) => {
    setLocalStorage(PROJECT_KEY, JSON.stringify(item));
    dispatch({ type: 'SET_PROJECT', project: item });
    location.reload();
  };

  const onVisibleChange = (visible: boolean) => {
    setListVisible(visible);
  };

  const getPreviewContent = () => {
    return (
      <div className="preview-content">
        <div className="tip">预览小程序(待联调)</div>
        <div className="qr-content">
          <QRCode value={(project && project.schema) || ''} size={102} />
        </div>
      </div>
    );
  };

  const getProjectListPop = () => {
    return (
      <div className="project-list">
        {list &&
          list.map((item: G.Project) => {
            return (
              <div
                key={item && item.appId}
                className={`project-item ${
                  item && project && item.appId === project.appId
                    ? 'active'
                    : ''
                }`}
                onClick={() => changeProject(item)}
              >
                <Avatar size={60} src={item.image} />
                <Tooltip title={item.name} placement="bottom">
                  <div className="project-name">{item.name}</div>
                </Tooltip>
              </div>
            );
          })}
      </div>
    );
  };

  useEffect(() => {
    const projectStr = getLocalStorageValue(PROJECT_KEY);
    if (projectStr && !project) {
      dispatch({ type: 'SET_PROJECT', project: JSON.parse(projectStr) });
    }
    requestProjectList();
  }, []);

  return (
    <>
      <Header></Header>
      <div className="inner-wapper">
        <div className="project-switch">
          <div className="project-info">
            <Popover
              content={getProjectListPop()}
              title=""
              overlayClassName={`project-list-popover ${
                listVisible ? '' : 'hidden'
              }`}
              visible={true}
              onVisibleChange={onVisibleChange}
            >
              <div
                className="project-selector-wapper"
                onMouseEnter={() => onVisibleChange(true)}
              >
                <div className="project-selector">
                  {project ? (
                    <div className="cur-project">
                      <Avatar size={40} src={project.image} />
                      <div className="project-name">{project.name}</div>
                    </div>
                  ) : null}
                </div>
                <i className="icon-project-list"></i>
              </div>
            </Popover>
            <Popover
              content={getPreviewContent()}
              title=""
              placement="bottomLeft"
              overlayClassName="qr-preview-popover"
            >
              <div className="project-preview">
                <i className="icon-qrcode"></i>
              </div>
            </Popover>
          </div>
          <div className="buttons">
            <Button onClick={onAdd} className="saveBtn middle-size">
              <i className="icon-add-new"></i>
              创建小程序
            </Button>
          </div>
        </div>
        <div className="inner-content-wapper">
          <Nav></Nav>
          <div className="inner-content">
            <div className="inner-page-wapper">
              <Comp {...props} />
            </div>
            <div className="copyright">
              <span className="en">
                {`Copyright 2006-${dayjs().format(
                  'YYYY'
                )} mgtv.com Corporation,All Rights Reserved`}
              </span>
              <span className="zh">
                XXXX有限公司 版权所有
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
