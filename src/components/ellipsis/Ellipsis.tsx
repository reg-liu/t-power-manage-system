import AntdEllipsis from 'ant-design-pro/lib/Ellipsis';
import React from 'react';

type EllipsisProps = {
  content: string;
  width?: number;
  lines?: number;
};

export default function Ellipsis({ content, width, lines }: EllipsisProps) {
  return (
    <div className="ellipsis-wapper" style={{ width: width || 200 }}>
      <AntdEllipsis tooltip={true} lines={lines || 1}>
        {content || ''}
      </AntdEllipsis>
    </div>
  );
}
