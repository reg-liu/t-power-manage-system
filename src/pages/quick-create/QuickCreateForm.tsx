import React, { useEffect, useState } from 'react';
import './index.less';
import FormItem from '@components/form-item';
import { getCategoryList } from '@api/BaseAPI';
import { Avatar, Switch } from 'antd';

type QuickCreateFormProps = {
  formData: any;
  onDataChange: Function;
  onValidateChange: Function;
  isEdit: boolean;
};

export default function QuickCreateForm(props: QuickCreateFormProps) {
  const { formData, onDataChange, onValidateChange, isEdit } = props;
  const [validateMap, setValidateMap] = React.useState({
    name: false,
    detail: false,
    image: false,
    categoryIds: false,
    agree: false,
  });
  const [categoryList, setCategoryList] = React.useState([]);
  const [categoryMap, setCategoryMap] = React.useState<any>();
  const [isAgree, setIsAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [curFormData, setCurFormData] = useState({
    name: '',
    detail: '',
    image: [],
    categoryIds: [''],
  });

  const onFormItemChange = (model: string, value: any) => {
    const newCurFormData = { ...curFormData };
    newCurFormData[model] = value;
    setCurFormData(newCurFormData);

    const categoryIds = [];
    newCurFormData.categoryIds.forEach((item: any) => {
      if (item) categoryIds.push(categoryMap[item].idPath.join(':'));
    });
    const formatData = {
      ...newCurFormData,
      type: 2,
      appId: '',
      image: newCurFormData.image.join(','),
      categoryIds: categoryIds.join(','),
    };
    onDataChange(formatData);
  };

  const onFormItemValidChange = (model: string, validate: boolean) => {
    const newValidateMap = { ...validateMap };
    newValidateMap[model] = validate;
    setValidateMap(newValidateMap);
    onValidateChange(newValidateMap);
  };

  const requestCategoryList = async () => {
    setLoading(true);
    const response = await getCategoryList();
    const newCategoryList = response.data.data.list;
    setCategoryList(newCategoryList);
    const newCategoryMap = {};
    formatCategoryMap(newCategoryList, [], '', newCategoryMap);
    setCategoryMap(newCategoryMap);
    setLoading(false);
  };

  const formatCategoryMap = (
    newCategoryList: any[],
    idPath: any[],
    namePath: string,
    newCategoryMap: any
  ) => {
    newCategoryList.forEach((item: any) => {
      const { id, name } = item;
      const curIdPath = [...idPath, id];
      const curNamePath = `${namePath}/${name}`;
      if (item.child.length) {
        formatCategoryMap(item.child, curIdPath, curNamePath, newCategoryMap);
      }
      newCategoryMap[id] = {
        idPath: curIdPath,
        namePath: curNamePath,
      };
    });
  };

  const onAgreeChange = (value: any) => {
    setIsAgree(value);
    onFormItemValidChange('agree', value);
  };

  useEffect(() => {
    if (categoryMap) {
      if (isEdit) {
        const newCurFormData = {
          ...formData,
        };
        setIsAgree(true);
        setValidateMap({
          name: true,
          detail: true,
          image: true,
          categoryIds: true,
          agree: true,
        });
        setCurFormData(newCurFormData);
      }
    } else {
      if (!loading) {
        requestCategoryList();
      }
    }
  }, [isEdit, categoryMap]);

  return (
    <div className="quick-create-form">
      <div className="page-tip">
        <i className="icon-alert-new"></i>
        请先
        <a
          className="link"
          href="http://open.imgo.tv/doc/standard/deny"
          target="_blank"
        >
          《小程序审核规范》
        </a>
        再进行信息填写
      </div>
      <div className="input-wrapper module-wapper">
        <div className="title">小程序信息</div>
        <div className="wrapper-content">
          <FormItem
            params={{
              model: 'name',
              label: '小程序名称',
              required: true,
              value: curFormData.name,
              minLength: 2,
              maxLength: 30,
              customValidate: {
                fn: (value: any) => {
                  return /^[a-zA-Z0-9_\+\-\u4e00-\u9fa5]+$/.test(value);
                },
                errorMsg: '仅支持中文、数字、英文、下划线、+、-',
              },
              bottomTip:
                '名称长度为2-30个字符，一个中文字等于2个字符；名称可以由中文、数字、英文、下划线、+、-组成，推荐品牌/商标/企业名称的关键字+类目',
            }}
            onChange={(value: any) => onFormItemChange('name', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('name', validate)
            }
          />
          <FormItem
            params={{
              model: 'detail',
              label: '小程序简介',
              required: true,
              value: curFormData.detail,
              minLength: 4,
              maxLength: 120,
              bottomTip: '简介长度为4-120个字符，需明确介绍小程序的功能点',
            }}
            onChange={(value: any) => onFormItemChange('detail', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('detail', validate)
            }
          />
          <FormItem
            params={{
              model: 'image',
              label: '小程序图标',
              required: true,
              type: 'image',
              listLimit: 1,
              sizeLimit: 2,
              value: curFormData.image,
              bottomTip:
                '图片格式为：png，jpg；不可大于2M，建议图片尺寸为144px * 144px',
            }}
            onChange={(value: any) => onFormItemChange('image', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('image', validate)
            }
          />
          <FormItem
            params={{
              model: 'categoryIds',
              label: '经营类目',
              required: true,
              type: 'category-picker',
              value: curFormData.categoryIds,
              customParams: {
                categoryList,
                categoryMap,
              },
            }}
            onChange={(value: any) => onFormItemChange('categoryIds', value)}
            onFormItemValidChange={(validate: boolean) =>
              onFormItemValidChange('categoryIds', validate)
            }
          />
          <div className="user-protocol-wrapper">
            <Switch
              checked={isAgree}
              onChange={(value: any) => onAgreeChange(value)}
            />
            <span>
              我已经阅读并同意
              <a
                className="link"
                href="http://open.imgo.tv/doc/standard/protocol"
                target="_blank"
              >
                《小程序开发者平台服务协议》
              </a>
            </span>
          </div>
        </div>
      </div>
      <div className="preview-wrapper module-wapper">
        <div className="title">效果预览</div>
        <div className="wrapper-content">
          <div className="preview-content">
            <Avatar
              size={120}
              src={curFormData.image.length && curFormData.image[0]}
            />
            <div className="preview-info">
              <div className="project-name">
                {curFormData.name || '小程序名称'}
              </div>
              <div className="project-detail">
                {curFormData.detail || '小程序简介'}
              </div>
              <div className="category-wrapper">
                {categoryMap &&
                  curFormData.categoryIds &&
                  curFormData.categoryIds.map((item: any, index: number) => {
                    const tagContent =
                      categoryMap &&
                      categoryMap[item] &&
                      categoryMap[item].namePath.slice(1);
                    return tagContent && index < 3 ? (
                      <span
                        className="category-item"
                        key={`${tagContent}${index}`}
                      >
                        {tagContent}
                      </span>
                    ) : (
                      <span key="null"></span>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
