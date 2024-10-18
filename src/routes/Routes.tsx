import { Router } from '@reach/router';
import React, { Suspense } from 'react';
import PrivateRoute from '@components/common/PrivateRoute';
import Welcome from '@pages/welcome/Welcome';
import InnerRoute from '@components/common/InnerRoute';

const Home = React.lazy(
  () => import(/* webpackChunkName: "Home" */ '@pages/homepage/HomePage')
);
const CreateGuide = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CreateGuide" */ '@pages/create-guide/CreateGuide'
    )
);

const FlowCreate = React.lazy(
  () =>
    import(/* webpackChunkName: "FlowCreate" */ '@pages/flow-create/FlowCreate')
);

const QuickCreate = React.lazy(
  () =>
    import(
      /* webpackChunkName: "QuickCreate" */ '@pages/quick-create/QuickCreate'
    )
);

const ProjectList = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ProjectList" */ '@pages/project-list/ProjectList'
    )
);

const Overview = React.lazy(
  () => import(/* webpackChunkName: "Overview" */ '@pages/overview/Overview')
);

const Auth = React.lazy(
  () => import(/* webpackChunkName: "Auth" */ '@pages/auth/Auth')
);

const Group = React.lazy(
  () => import(/* webpackChunkName: "Group" */ '@pages/group/Group')
);

const VersionManage = React.lazy(
  () =>
    import(
      /* webpackChunkName: "VersionManage" */ '@pages/version-manage/VersionManage'
    )
);

const DevSetting = React.lazy(
  () =>
    import(/* webpackChunkName: "DevSetting" */ '@pages/dev-setting/DevSetting')
);

const AuthCheck = React.lazy(
  () =>
    import(/* webpackChunkName: "AuthCheck" */ '@pages/check/auth/AuthCheck')
);

const Framework = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Framework" */ '@pages/file-manage/framework/Framework'
    )
);

const DevTool = React.lazy(
  () =>
    import(
      /* webpackChunkName: "DevTool" */ '@pages/file-manage/dev-tool/DevTool'
    )
);

const PublishCheck = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AuthCheck" */ '@pages/check/publish/PublishCheck'
    )
);

export function Routes() {
  return (
    <React.Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <PrivateRoute as={Welcome} default path="/" />
          <PrivateRoute as={Home} path="/home" />
          <PrivateRoute as={CreateGuide} path="/create-guide" />
          <PrivateRoute as={FlowCreate} path="/flow-create" />
          <PrivateRoute as={QuickCreate} path="/quick-create" />
          <PrivateRoute as={ProjectList} path="/project-list" />
          <InnerRoute as={Overview} path="/overview" />
          <InnerRoute as={Auth} path="/auth" />
          <InnerRoute as={Group} path="/develop/group" />
          <InnerRoute as={VersionManage} path="/develop/version-manage" />
          <InnerRoute as={QuickCreate} path="/setting/basic" />
          <InnerRoute as={DevSetting} path="/setting/dev-setting" />
          <InnerRoute as={AuthCheck} path="/check/auth" />
          <InnerRoute as={PublishCheck} path="/check/publish" />
          <InnerRoute as={Framework} path="/file/framework" />
          <InnerRoute as={DevTool} path="/file/dev-tool" />
        </Router>
      </Suspense>
    </React.Fragment>
  );
}
