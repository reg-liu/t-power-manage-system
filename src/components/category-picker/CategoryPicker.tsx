import { Cascader } from 'antd';
import React, { useEffect } from 'react';

import './index.less';

type CategoryPickerProps = {
  params: any;
  onValueChange: Function;
  categoryList: any[];
  categoryMap: any;
};

export default function CategoryPicker(props: CategoryPickerProps) {
  const { params, onValueChange, categoryList, categoryMap } = props;

  const [curList, setCurList] = React.useState(
    params.value && params.value.length ? params.value : ['']
  );

  const displayRender = (label) => {
    return label.join('/');
  };

  const onChange = (arr, index) => {
    const value = arr.pop();
    const newCurList = [];
    curList.forEach((item: any, itemIndex: number) => {
      const itemValue = index !== itemIndex ? item : value;
      newCurList.push(itemValue);
    });
    setCurList(newCurList);
    changeFormValue(newCurList);
  };

  const onAdd = () => {
    const newCurList = [...curList];
    newCurList.push('');
    setCurList(newCurList);
  };

  const onDelete = (index: number) => {
    const newCurList = [];
    curList.forEach((item: any, itemIndex: number) => {
      if (index !== itemIndex) {
        newCurList.push(item);
      }
    });
    setCurList(newCurList);
    changeFormValue(newCurList);
  };

  const changeFormValue = (newCurList: any) => {
    const newParamsValue = [];
    newCurList.forEach((item: any) => {
      if (item) newParamsValue.push(item);
    });
    onValueChange(newParamsValue);
  };

  useEffect(() => {
    if (
      params.value &&
      params.value.length &&
      params.value.length !== curList.length
    ) {
      setCurList(params.value);
    }
  }, [params.value]);

  return (
    <div className="category-list-wrapper">
      {curList.map((item: any, index: number) => {
        const curValue = item ? categoryMap[item].idPath : '';
        return (
          <div className="category-list-item" key={`${item}${index}`}>
            <Cascader
              options={categoryList}
              popupClassName="category-picker-popup"
              expandTrigger="hover"
              placeholder="请选择"
              value={curValue}
              fieldNames={{ label: 'name', value: 'id', children: 'child' }}
              displayRender={displayRender}
              onChange={(value) => onChange(value, index)}
            />
            {curList.length === index + 1 ? (
              <span className="link-btn" onClick={onAdd}>
                添加
              </span>
            ) : null}
            {curList.length !== 1 ? (
              <span className="link-btn" onClick={() => onDelete(index)}>
                删除
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
