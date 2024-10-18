import React from 'react';
import { RouteComponentProps } from '@reach/router';
import Header from '@components/header/Header';
import dayjs from 'dayjs';
interface PrivateRouteProps extends RouteComponentProps {
  as: React.ElementType<any>;
}

export default function PrivateRoute({
  as: Comp,
  ...props
}: PrivateRouteProps) {
  const hideHeader = props.path === '/home' || props.path === '/';
  const hideFooter = props.path === '/home' || props.path === '/';

  return (
    <>
      {hideHeader ? null : <Header></Header>}
      <div className={`private-content ${hideHeader?'hide-header':''}`}>
        <Comp {...props} />
      </div>
      {hideFooter ? null : 
        <div
          className="copyright"
          style={{
            backgroundColor: hideHeader ? '#05071a' : '#fff',
          }}
        >
          <span className="en">
            {`Copyright 2006-${dayjs().format(
              'YYYY'
            )} mgtv.com Corporation,All Rights Reserved`}
          </span>
          <span className="zh">XXXX 版权所有</span>
        </div>
        }
    </>
  );
}
