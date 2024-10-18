import FormItem from '@components/form-item';
import { Button } from 'antd';
import React from 'react';

import './index.less';

type FilterItem = {
  label: string;
  type: string;
  model: string;
  value: any;
  options: any[];
};

type ButtonsItem = {
  label: string;
  className?: string;
  icon?: string;
  onClick?: Function;
};

type ToolbarProps = {
  filters?: FilterItem[];
  buttons?: ButtonsItem[];
  onFilterChange: Function;
};

export default function Toolbar({
  filters,
  buttons,
  onFilterChange,
}: ToolbarProps) {
  const onValueChange = (model: string, value: any) => {
    onFilterChange(model, value);
  };

  const getFilterItem = (item) => {
    const { model, label, type, options, value } = item;
    return (
      <FormItem
        key={model}
        params={{
          model,
          label,
          type,
          options,
          value,
        }}
        onChange={(value: any) => onValueChange('status', value)}
      />
    );
  };

  const getButtonItem = (item) => {
    const { className, label, icon, onClick } = item;
    return (
      <Button icon className={className} onClick={() => onClick()}>
        {icon ? <i className={icon}></i> : null}
        {label}
      </Button>
    );
  };

  return (
    <div className="toolbar">
      <div className="buttons-wrapper">
        {buttons &&
          buttons.map((item: any) => {
            return <span key={item.label}>{getButtonItem(item)}</span>;
          })}
      </div>
      <div className="filters-wrapper">
        {filters &&
          filters.map((item: any) => {
            return <span key={item.label}>{getFilterItem(item)}</span>;
          })}
      </div>
    </div>
  );
}
