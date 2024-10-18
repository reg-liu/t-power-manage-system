import React, { useEffect } from 'react';
import jsonp from 'jsonp';
import OSS from 'ali-oss';

import { LoadingOutlined } from '@ant-design/icons';

import { message, Upload } from 'antd';
import useAuth from '@context/auth';
import { isNumber } from 'util';
import { isNumberType } from '@Utils';

type ImgUploadProps = {
  params: any;
  onValueChange: Function;
};

export default function ImgUpload(props: ImgUploadProps) {
  const {
    state: { user },
  } = useAuth();

  const { params, onValueChange } = props;

  const [loading, setLoading] = React.useState(false);
  const [curList, setCurList] = React.useState(params.value);

  const beforeUpload = (file, index) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLtSizeLimit = file.size / 1024 / 1024 < params.sizeLimit;
    if (!isLtSizeLimit || !isJpgOrPng) {
      message.error(`图片格式为：png，jpg；不可大于${params.sizeLimit}M。`);
    } else {
      doUpload(file, index);
    }
    return isJpgOrPng && isLtSizeLimit;
  };

  const getFileList = (urls: string[]) => {
    const fileList = [];
    urls.forEach((item: any) => {
      if (item) {
        fileList.push({
          status: 'done',
          url: item,
        });
      }
    });
    return fileList;
  };

  const onRemoveImg = (file: any, index?: any) => {
    let newImageList = [];
    if (isNumberType(index)) {
      newImageList = [...curList];
      newImageList[index] = '';
    } else {
      params.value.forEach((item: any) => {
        if (item !== file.url) newImageList.push(item);
      });
    }
    setCurList(newImageList);
    onValueChange(newImageList);
    return true;
  };

  const doUpload = (file: any, index) => {
    setLoading(true);
    jsonp(
      `http://upload-ugc.bz.mgtv.com/upload/image/getStsToken?ticket=${user.ticket}&uuid=${user.uuid}&biz=1&num=1`,
      null,
      async (err, res) => {
        if (err) {
          message.error('请求失败，请检查网络环境');
          setLoading(false);
        } else {
          const client = new OSS({
            accessKeyId: res.data.stsToken.accessKeyId, // 你创建的Bucket时获取的
            accessKeySecret: res.data.stsToken.accessKeySecret, // 你创建的Bucket时获取的
            bucket: res.data.bucketInfo.bucket, // 你创建的Bucket名称
            region: 'oss-cn-beijing', //  你所购买oss服务的区域，默认oss-cn-hangzhou
            stsToken: res.data.stsToken.securityToken,
          });
          const fileName = file.name.split('.')[1];
          const pic = await client.put(
            res.data.bucketInfo.keys[0] + '.' + fileName,
            file
          );
          let newImageList = [...params.value];
          if (isNumberType(index)) {
            newImageList[index] = pic.url;
          } else {
            newImageList = [...params.value, pic.url];
          }
          onValueChange(newImageList);
          setLoading(false);
          setCurList(newImageList);
        }
      }
    );
  };

  const uploadButton = (text?: string) => {
    return (
      <div className="upload-wrapper">
        <div className="icon-wrapper">
          {loading ? <LoadingOutlined /> : <i className="icon-add-new"></i>}
        </div>
        <div className="tip">{text || '上传图片'}</div>
      </div>
    );
  };

  useEffect(() => {
    if (params.value.length && !curList.length) {
      setCurList(params.value);
    }
  }, [params.value.length]);

  return (
    <>
      {params.fixedImage ? (
        <div className="fixed">
          {params.fixedImage.map((item: string, index: number) => {
            return (
              <Upload
                key={index}
                listType="picture-card"
                fileList={getFileList([curList[index]])}
                beforeUpload={(file) => beforeUpload(file, index)}
                onRemove={(file) => onRemoveImg(file, index)}
              >
                {curList[index] ? null : uploadButton(item)}
              </Upload>
            );
          })}
        </div>
      ) : (
        <Upload
          listType="picture-card"
          fileList={getFileList(curList)}
          beforeUpload={beforeUpload}
          onRemove={onRemoveImg}
        >
          {params.value.length >= (params.listLimit || 1)
            ? null
            : uploadButton()}
        </Upload>
      )}
    </>
  );
}
