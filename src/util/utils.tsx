import { ProjectStatus } from '@config';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import MD5 from 'crypto-js/md5';
import { JSEncrypt } from 'jsencrypt';

const publickey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbb4wSEg1zG6SzoWrhcBwDRYJxtPum5g38kp8V
xikOjS04/67dMrEIcA/qeil9n9L9VGKieWRcyXJgU/ZE9U35yE5LlZYYsNK+Fj7SMpwDXD06xdWQ
8Y0qS6Bc1vTKJPT6tfRW/ZPJLLKz6GDWm3HXcnhd6gIlzjWzRu/e+NwHjQIDAQAB
-----END PUBLIC KEY-----`;

//获取本地存储的数据
export function getLocalStorageValue(key: string) {
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}
//设置本地存储的数据
export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, JSON.stringify(value));
}
//防抖函数
export function debounced(callback: Function, time: number) {
  let lastTime: number;
  return (args: any[]) => {
    if (!lastTime || new Date().getTime() - lastTime > time) {
      lastTime = new Date().getTime();
      callback(args);
    }
  };
}
// 绑定事件监听的处理hook函数
export function useEventListener(
  eventName: string,
  handler: (event: any) => void,
  element = window
) {
  // 创建一个 ref 来存储处理程序
  const saveHandler = { current: (event: any) => {} };

  // 如果 handler 变化了，就更新 ref.current 的值。
  // 这个让我们下面的 effect 永远获取到最新的 handler
  React.useEffect(() => {
    saveHandler.current = handler;
  }, [handler]);

  React.useEffect(
    () => {
      // 确保元素支持 addEventListener
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // 创建事件监听调用存储在 ref 的处理方法
      const eventListener = (event: any) => saveHandler.current(event);

      // 添加事件监听
      element.addEventListener(eventName, eventListener);

      // 清除的时候移除事件监听
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // 如果 eventName 或 element 变化，就再次运行
  );
}

//返回替换{0，1...}后的字符串
export function strFormat(mapedStr: string, args?: any[]) {
  if (args && args.length === 0) return mapedStr;
  if (args) {
    for (let i = 0; i < args.length; i++) {
      mapedStr = mapedStr.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
    }
  }
  return mapedStr;
}

export function getLength(str: string) {
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
  ///<param name="str">要获得长度的字符串</param>
  let realLength = 0;
  const len = str.length;
  let charCode = -1;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
}

export function isNumberType(obj) {
  return obj === +obj;
}

export function getProjectStatus(status: number, info?: string) {
  const statusInfo = ProjectStatus[status];
  return (
    <span className={`status-label ${statusInfo.class}`}>
      <span> {statusInfo.name}</span>
      {info && (status === 3 || status === 6) ? (
        <Tooltip title={info}>
          <i className="icon-help"></i>
        </Tooltip>
      ) : null}
    </span>
  );
}

export function addTimeSorter(a, b) {
  return dayjs(a).unix() - dayjs(b).unix();
}

export class SignTool {
  static encrypt: JSEncrypt;

  /**
   * RSA 加密
   */
  static RSA(unSignStr: string) {
    if (!this.encrypt) {
      this.encrypt = new JSEncrypt({});
      this.encrypt.setPublicKey(publickey);
    }
    return this.encrypt.encrypt(unSignStr);
  }

  /**
   * 签名算法
   * 1、将参与签名的字段key按ASCII码从小到大排序，按k1=v1&k2=v2格式拼接。
   * 2、在第1步中的签名串后面加上"&secret_key=secret"，再转为小写，做md5处理，得到的串再转为小写。
   * @param option
   */
  static sign(option: any) {
    const str =
      Object.keys(option)
        .sort()
        .map((key) => `${key}=${option[key]}`)
        .join('&') + `&secret_key=8658e88dafc78f2e`;

    return MD5(str.toLowerCase()).toString().toLowerCase();
  }
}
