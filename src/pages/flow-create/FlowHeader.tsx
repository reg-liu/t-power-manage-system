import React, { useEffect, useState } from 'react';

type FlowHeaderProps = {
  step: number;
};

const stepsConfig = [
  {
    name: '创建小程序',
    icon: 'create',
  },
  {
    name: '开发调试',
    icon: 'develop',
  },
  {
    name: '身份认证',
    icon: 'auth',
  },
  {
    name: '审核发布',
    icon: 'publish',
  },
  {
    name: '应用运营',
    icon: 'manage',
  },
];

export default function FlowHeader(props: FlowHeaderProps) {
  const { step } = props;

  const [curStep, setCurStep] = useState(0);

  useEffect(() => {
    setCurStep(step);
  }, [step]);

  return (
    <div className={`flow-header-wapper flow${curStep}`}>
      {stepsConfig.map((item: any, index: number) => {
        return (
          <div
            key={item.icon}
            className={`flow-header-item ${index === curStep ? 'active' : ''}`}
          >
            <i className={`icon-${item.icon}`}>{item.name}</i>
          </div>
        );
      })}
    </div>
  );
}
