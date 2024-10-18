import { filterMenus, Menus } from '@config';
import useAuth from '@context/auth';
import { navigate, useLocation } from '@reach/router';
import { Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';

const SubMenu = Menu.SubMenu;

export default function Nav() {
  const {
    state: { user },
  } = useAuth();

  const [curPath, setCurPath] = useState('');
  const [openKeys, setOpenKeys] = useState([]);
  const location = useLocation();
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [allowedPaths, setAllowedPaths] = useState([]);

  const handleMenuClick = (item: any) => {
    navigate(item.key);
  };

  const onOpenChange = (curOpenKeys: any) => {
    setOpenKeys(curOpenKeys);
  };

  const renderChildMenu = (item: any) => {
    const { path, name, children } = item;
    if (!children || !children.length) {
      return <Menu.Item key={path}>{name}</Menu.Item>;
    } else {
      return (
        <SubMenu key={path} title={name} className="parentMenu">
          {children.map((menuItem: any) => renderChildMenu(menuItem))}
        </SubMenu>
      );
    }
  };

  const renderMenu = () => {
    // if (!user) return null;
    return (
      <Menu
        mode="inline"
        onClick={(item: any) => handleMenuClick(item)}
        openKeys={openKeys}
        selectedKeys={[curPath]}
        onOpenChange={onOpenChange}
      >
        {filteredMenus.map((menuItem: any) => renderChildMenu(menuItem))}
      </Menu>
    );
  };

  const authorityJudge = () => {
    const currentPath = location.pathname;
    if (allowedPaths.length) {
      if (allowedPaths.includes(currentPath)) {
        return true;
      } else {
        navigate('/overview');
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (!allowedPaths.length) {
      const filters = [];
      // if (user && !user.isAdmin) {
        filters.push('admin');
      // }
      const [curFilteredMenus, curAllowedPaths] = filterMenus(Menus, filters);
      setFilteredMenus(curFilteredMenus);
      setAllowedPaths(curAllowedPaths);
    }
  }, [user]);

  useEffect(() => {
    if (allowedPaths.length && authorityJudge()) {
      const currentPath = location.pathname;
      const curOpenKeys = [];
      let parentPath = '';
      const splitDir = currentPath.split('/');
      splitDir.forEach((dir) => {
        if (dir) {
          parentPath = parentPath + '/' + dir;
          curOpenKeys.push(parentPath);
        }
      });
      setCurPath(currentPath);
      setOpenKeys(curOpenKeys);
    }
  }, [location.pathname, allowedPaths.length]);

  return <div className="menu-wrap">{renderMenu()}</div>;
}
