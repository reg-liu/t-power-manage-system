import React, { useEffect } from 'react';
import jsonp from 'jsonp';
import OSS from 'ali-oss';
import BMF from 'browser-md5-file';

import { Button, message, Upload } from 'antd';
import useAuth from '@context/auth';

type FileUploadProps = {
  onValueChange: Function;
  type: string;
};

export default function FileUpload(props: FileUploadProps) {
  const {
    state: { user },
  } = useAuth();

  const { onValueChange, type } = props;

  const [loading, setLoading] = React.useState(false);
  const [curFile, setCurFile] = React.useState('');

  const beforeUpload = (file) => {
    const allowTypes = type.split('|');
    let isValidType = false;
    allowTypes.forEach((item: string) => {
      if (file.name.endsWith(`.${item}`)) {
        isValidType = true;
      }
    });
    const isLtSizeLimit = file.size / 1024 / 1024 < 5;
    if (!isLtSizeLimit || !isValidType) {
      message.error(`只能上传${type}文件，不可大于5M。`);
    } else {
      doUpload(file);
    }
    return isValidType && isLtSizeLimit;
  };

  const doUpload = (file: any) => {
    setLoading(true);
    const bmf = new BMF();

    bmf.md5(
      file,
      (err, md5) => {
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
              const nameSplitArr = file.name.split('.');
              const fileSuffix = nameSplitArr[nameSplitArr.length - 1];
              let zip;
              try {
                zip = await client.put(
                  res.data.bucketInfo.keys[0] + '.' + fileSuffix,
                  file
                );
              } catch (e) {
                message.error('上传失败，请检查网络环境及广告拦截插件');
                setLoading(false);
              }
              if (zip) {
                const finalUrl = `${zip.url}|${md5}`;
                onValueChange(finalUrl);
                setCurFile(zip.url);
                setLoading(false);
              }
            }
          }
        );
      },
      (progress) => {
        console.log('progress number:', progress);
      }
    );
  };

  return (
    <>
      <Upload
        name="file"
        showUploadList={false}
        beforeUpload={(file) => beforeUpload(file)}
      >
        <Button loading={loading} className="confirmBtn no-shadow">
          {curFile ? '更改文件' : '点击上传'}
        </Button>
      </Upload>
    </>
  );
}
