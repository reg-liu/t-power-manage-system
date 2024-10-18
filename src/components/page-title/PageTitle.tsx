import { navigate } from '@reach/router';
import React from 'react';

import './index.less';

type PageTitleProps = {
  showBack?: boolean;
  title: string;
  onBack?: Function;
};

export default function PageTitle({ showBack, title, onBack }: PageTitleProps) {
  const backClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="page-title">
      <div className="back-wrapper">
        {showBack ? (
          <i className="icon-arr-left" onClick={backClick}></i>
        ) : null}
      </div>
      <div className="title-wrapper">{title}</div>
    </div>
  );
}
