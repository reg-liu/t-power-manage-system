import React from 'react';
import { HeaderMenus } from '@config';
import Menu from 'antd/lib/menu';
import useAuth from '@context/auth';
import 'antd/lib/menu/style/css';
import 'antd/lib/input/style/css';

import './index.less';
import { Avatar, Popover, Tooltip } from 'antd';
import { doLogout } from '@api/AuthAPI';
import { navigate } from '@reach/router';

export default function Header() {
  const {
    state: { user },
    dispatch,
  } = useAuth();

  const handleMenuClick = (item: any) => {
    window.location.href = item.key;
  };

  const logout = () => {
    doLogout(dispatch);
  };

  const renderLinks = () => {
    return (
      <div className="header-nav-wrap">
        <Menu onClick={handleMenuClick} mode="horizontal" theme="dark">
          {HeaderMenus.map((item: any) => {
            return (
              <Menu.Item key={item.name}>
                <nav className={`header-nav`}>{item.name}</nav>
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  };

  const onNaviagteList = async () => {
    navigate('/project-list');
  };

  const headerClass =
    user && user.ticket ? 'header-wrap' : 'header-wrap nouser';

  const content = (
    <div className="logout-btn" onClick={logout}>
      退出登录
    </div>
  );

  return (
    <div className={headerClass}>
      <div className="logo-wrap" onClick={onNaviagteList}></div>
      {user ? (
        <div className="user-wrap">
          <Avatar size={40} src={user.avatar.xl} />
          <span className="nickname">{user.nickname}</span>
          <Popover
            placement="bottomRight"
            title={null}
            content={content}
            trigger="hover"
            overlayClassName="logout-popover"
          >
            <i className="icon-arr-down"></i>
          </Popover>
        </div>
      ) : null}
      {renderLinks()}
    </div>
  );
}
