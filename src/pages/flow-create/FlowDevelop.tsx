import useAuth from '@context/auth';
import { message } from 'antd';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const stepsConfig = [
  {
    name: '复制 App ID',
    link: '点击复制',
  },
  {
    name: '下载开发者工具',
    link: '点击下载',
    href: 'http://open.imgo.tv/doc/develop/tool/update',
  },
  {
    name: '登录并创建项目',
    link: '查看文档',
    href: 'http://open.imgo.tv/doc/develop/tool/interface/start',
  },
  {
    name: '开发调试上传',
    link: '查看文档',
    href: 'http://open.imgo.tv/doc/develop/tool/interface/main',
  },
];

export default function FlowDevelop() {
  const {
    state: { project },
  } = useAuth();

  const doCopy = () => {
    message.success('AppID已复制到粘贴板！');
  };

  return (
    <div className={`flow-develop`}>
      {stepsConfig.map((item: any, index: number) => {
        return (
          <div key={item.name} className="flow-develop-item">
            <div className={`index-wrapper step${index}`}></div>
            <div className="name-wrapper">{item.name}</div>
            <div className="link-wrapper">
              {item.href ? (
                <a className="link" href={item.href} target="_blank">
                  {item.link}
                </a>
              ) : (
                <CopyToClipboard text={project && project.appId}>
                  <button className="link" onClick={() => doCopy()}>
                    {item.link}
                  </button>
                </CopyToClipboard>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
