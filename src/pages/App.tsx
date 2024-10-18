import React from 'react';
import { Routes } from '@Routes';
import { getCurrentUser, handleUserResponse } from '@api/AuthAPI';
import useAuth, { AuthProvider } from '@context/auth';
import { TICKET_KEY } from '@api/APIUtils';
import { getLocalStorageValue } from '@Utils';
import { navigate } from '@reach/router';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import '../assets/css/global.less';
import { ConfigProvider } from 'antd';

function App() {
  const {
    state: { user },
    dispatch,
  } = useAuth();
  React.useEffect(() => {
    let ignore = false;
    // const ticket = getLocalStorageValue(TICKET_KEY);
    // async function fetchUser() {
    //   try {
    //     let userInfo: any = await getCurrentUser(ticket);
    //     if (userInfo.data.data) {
    //       userInfo = userInfo.data.data;
    //       if (!ignore) {
    //         handleUserResponse(userInfo, dispatch);
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    // if (!user && ticket) {
    //   fetchUser();
    // } else if (!ticket) {
    //   navigate('/home');
    // }

    return () => {
      ignore = true;
    };
  }, [dispatch, user]);

  return (
    <React.Fragment>
      <Routes />
    </React.Fragment>
  );
}

export default () => (
  <AuthProvider>
    <ConfigProvider locale={zh_CN}>
      <App />
    </ConfigProvider>
  </AuthProvider>
);
