import React from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import './index.less';

export default function CreateGuide(_: RouteComponentProps) {
  const doFlowCreate = () => {
    navigate('/flow-create');
  };

  const doQuickCreate = () => {
    navigate('/quick-create');
  };

  return (
    <div className="page-create-guide">
      <span className="create-guide-tip">快来创建您的第一个小程序吧～</span>
      <div className="btn-wrapper">
        <div className="flow-wrapper" onClick={doFlowCreate}>
          <div className="content-wrapper">
            <span className="main">开发流程指引</span>
            <span className="sub">我是新用户，需要按流程创建</span>
          </div>
        </div>
        <div className="quick-wrapper" onClick={doQuickCreate}>
          <div className="content-wrapper">
            <span className="main">直接创建</span>
            <span className="sub">我是老用户，直接创建基础信息</span>
          </div>
        </div>
      </div>
      <div className="link-wrapper">
        <div className="flow-link link-item">
          查看
          <a
            className="link"
            href="http://open.imgo.tv/doc/introduction/create"
            target="_blank"
          >
            快速开始
          </a>
          ，了解每个步骤
        </div>
        <div className="doc-link link-item">
          查看
          <a className="link" href="http://open.imgo.tv/doc/" target="_blank">
            文档中心
          </a>
          ，了解开发细节
        </div>
      </div>
    </div>
  );
}
