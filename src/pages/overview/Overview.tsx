import { navigate } from '@reach/router';
import React, { useEffect, useState } from 'react';

import './index.less';

const overviewList = [
  {
    icon: 'flow-guide',
    title: '开发流程指引',
    desc: '从创建小程序到应用运营操作指引',
    link: '/flow-create',
  },
  {
    icon: 'auth',
    title: '身份认证',
    desc: '身份认证完成后才能执行版本审核发布操作',
    link: '/auth',
  },
  {
    icon: 'dev-tool',
    title: '开发者工具',
    desc: '',
  },
  {
    icon: 'document',
    title: '文档中心',
    desc: '了解小程序开发运营过程中的各项问题',
    link: 'http://open.imgo.tv/doc',
  },
  {
    icon: 'parse',
    title: '小程序转化',
    desc: '微信小程序自动转化为小程序',
  },
  {
    icon: 'service',
    title: '联系我们',
    desc: '问题反馈，合作咨询',
  },
];

export default function Overview() {
  const itemClick = (link: string) => {
    if (!link) return;
    if (link.includes('://')) {
      window.open(link);
    } else {
      navigate(link);
    }
  };

  return (
    <div className="page-overview">
      {overviewList.map((item: any) => {
        return (
          <div
            key={item.title}
            className="overview-item"
            onClick={() => itemClick(item.link)}
          >
            <div className={`image-wapper ${item.icon}`}>
              <div className="icon-wapper">
                <i className={`icon-${item.icon}`}></i>
              </div>
            </div>
            <div className="content">
              <div className="title">{item.title}</div>
              {item.icon === 'dev-tool' ? (
                <div className="download">
                  <div className="download-item">
                    <i className="icon-mac"></i>
                    <a
                      href="http://open.imgo.tv/doc/develop/tool/update"
                      className="link"
                      target="_blank"
                    >
                      Mac
                    </a>
                  </div>
                  <div className="download-item">
                    <i className="icon-windows"></i>
                    <a
                      href="http://open.imgo.tv/doc/develop/tool/update"
                      className="link"
                      target="_blank"
                    >
                      Windows
                    </a>
                  </div>
                </div>
              ) : (
                <div className="desc">{item.desc}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
