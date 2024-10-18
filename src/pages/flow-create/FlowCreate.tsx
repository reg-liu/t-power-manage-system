import React, { useState } from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import FlowHeader from './FlowHeader';

import './index.less';
import QuickCreate from '@pages/quick-create/QuickCreate';
import FlowDevelop from './FlowDevelop';
import { Button } from 'antd';
import Auth from '@pages/auth/Auth';
import VersionManage from '@pages/version-manage/VersionManage';
import FlowManage from './FlowManage';

export default function FlowCreate(_: RouteComponentProps) {
  const [step, setStep] = useState(0);

  const onCreateSuccess = () => {
    setStep(1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const doLeave = () => {
    navigate('/overview');
  };

  return (
    <div className="page-flow-create">
      <FlowHeader step={step}></FlowHeader>
      <div className="content-wrapper">
        {step === 0 ? (
          <QuickCreate isFlowCreate onSuccess={onCreateSuccess} />
        ) : null}
        {step === 1 ? <FlowDevelop /> : null}
        {step === 2 ? <Auth isFlowCreate onSuccess={nextStep} /> : null}
        {step === 3 ? <VersionManage isFlowCreate /> : null}
        {step === 4 ? <FlowManage /> : null}
        {step === 1 || step === 3 ? (
          <div className="footer-wrapper">
            <Button onClick={nextStep} className="saveBtn">
              下一步
            </Button>
            <Button onClick={doLeave} className="cancelBtn">
              离开
            </Button>
          </div>
        ) : null}
        {step === 4 ? (
          <div className="footer-wrapper">
            <Button onClick={doLeave} className="saveBtn">
              完成
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
