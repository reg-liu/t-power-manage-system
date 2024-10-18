import React, { useEffect, useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import { Avatar, Button, Skeleton, Tooltip } from 'antd';
import useAuth from '@context/auth';
import { getCategoryList, getProjectList } from '@api/BaseAPI';
import {
  ProjectBasicReviewing,
  ProjectOnline,
  ProjectPublishReviewing,
  ProjectStatus,
} from '@config';

import './index.less';
import { PROJECT_KEY } from '@api/APIUtils';
import { getProjectStatus, setLocalStorage } from '@Utils';

export default function ProjectList(_: RouteComponentProps) {
  const {
    state: { user },
    dispatch,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [list, setList] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [onlineCount, setOnlineCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const requestProjectList = async () => {
    setLoading(true);
    const response: any = await getProjectList();
    const { list } = response.data.data;
    let newOnlineCount = 0;
    let newReviewCount = 0;

    const formatList = list.map((projectItem: any) => {
      const oriCategory = projectItem.categoryIds || '196:200;206:207;196:200';
      const formatCategory = oriCategory.split(';').map((item: any) => {
        return item.split(':').pop();
      });
      if (projectItem.status === ProjectOnline) {
        newOnlineCount += 1;
      } else if (
        projectItem.status === ProjectBasicReviewing ||
        projectItem.status === ProjectPublishReviewing
      ) {
        newReviewCount += 1;
      }
      setOnlineCount(newOnlineCount);
      setReviewCount(newReviewCount);
      return { ...projectItem, categoryIds: formatCategory };
    });

    dispatch({ type: 'SET_PROJECTS', projects: formatList });
    const curProject = formatList[0];
    dispatch({ type: 'SET_PROJECT', project: curProject });
    setLocalStorage(PROJECT_KEY, JSON.stringify(curProject));
    setList(formatList);
    setLoading(false);
  };

  const requestCategoryList = async () => {
    const response = await getCategoryList();
    const newCategoryList = response.data.data.list;
    const newCategoryMap = {};
    formatCategoryMap(newCategoryList, [], '', newCategoryMap);
    setCategoryMap(newCategoryMap);
  };

  const formatCategoryMap = (
    newCategoryList: any[],
    idPath: any[],
    namePath: string,
    newCategoryMap: any
  ) => {
    newCategoryList.forEach((item: any) => {
      const { id, name } = item;
      const curIdPath = [...idPath, id];
      const curNamePath = `${namePath}/${name}`;
      if (item.child.length) {
        formatCategoryMap(item.child, curIdPath, curNamePath, newCategoryMap);
      }
      newCategoryMap[id] = {
        idPath: curIdPath,
        namePath: curNamePath,
      };
    });
  };

  const onProjectClick = (project: G.Project) => {
    dispatch({ type: 'SET_PROJECT', project });
    setLocalStorage(PROJECT_KEY, JSON.stringify(project));
    navigate('/overview');
  };

  const onAdd = () => {
    navigate('/quick-create');
  };

  const changeExpand = () => {
    setIsExpand(!isExpand);
  };

  useEffect(() => {
    requestCategoryList();
    requestProjectList();
  }, []);

  return (
    <div className="page-project-list">
      <section>
        <div className="tool-wrapper">
          {loading ? null : (
            <div className="info-wrapper">
              {user && !user.isCert ? (
                <div className="auth-wrapper">
                  当前已上线 <span className="green">{onlineCount}</span>{' '}
                  个，审核中 <span className="orange">{reviewCount}</span> 个
                </div>
              ) : (
                <div className="unauth-wrapper">
                  <span>未验证主体真实性之前，小程序无法发布上线。</span>
                  <a className="link" href="/auth" target="_blank">
                    立即认证
                  </a>
                </div>
              )}
            </div>
          )}
          <Button onClick={onAdd} className="saveBtn no-shadow">
            <i className="icon-add-new"></i>创建小程序
          </Button>
        </div>
        <div className="list-wrapper">
          {loading ? null : (
            <>
              {list
                .slice(0, isExpand ? list.length : 4)
                .map((projectItem: G.Project) => {
                  return (
                    <div
                      className="list-item"
                      key={projectItem.appId}
                      onClick={() => onProjectClick(projectItem)}
                    >
                      <Avatar size={120} src={projectItem.image} />
                      <div className="project-info">
                        <div className="project-name">
                          <Tooltip title={projectItem.name || ''}>
                            {projectItem.name || ''}
                          </Tooltip>
                          {getProjectStatus(projectItem.status)}
                        </div>
                        <div className="project-detail content-wrapper">
                          <span className="label">简介</span>
                          <span className="value">
                            <Tooltip title={projectItem.detail || ''}>
                              {projectItem.detail || '小程序简介'}
                            </Tooltip>
                          </span>
                        </div>
                        <div className="category-wrapper content-wrapper">
                          <span className="label">类目</span>
                          <span className="value">
                            {projectItem.categoryIds.map(
                              (item: any, index: number) => {
                                let tagContent =
                                  categoryMap &&
                                  categoryMap[item] &&
                                  categoryMap[item].namePath;
                                if (tagContent) {
                                  tagContent = tagContent.split('/').pop();
                                }
                                return tagContent && index < 2 ? (
                                  <span
                                    className="category-item"
                                    key={`${tagContent}${index}`}
                                  >
                                    {tagContent}
                                  </span>
                                ) : (
                                  ''
                                );
                              }
                            )}
                          </span>
                        </div>
                        <div className="project-appid content-wrapper">
                          <span className="label">AppID</span>
                          <span className="value">
                            {projectItem.appId || ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
        {list.length > 4 ? (
          <div className="expand link" onClick={changeExpand}>
            {isExpand ? '收起' : '查看更多'}
          </div>
        ) : null}
        {loading ? <Skeleton /> : null}
      </section>
    </div>
  );
}
