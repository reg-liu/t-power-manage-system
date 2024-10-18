import React, { useEffect, useRef, useState } from 'react';
import {
  login,
  sendSMSCode,
  getQrcodeUrl,
  getCurrentUser,
  handleUserResponse,
  getQrcodeResult,
} from '@api/AuthAPI';
import { RouteComponentProps } from '@reach/router';
import useAuth from '@context/auth';
import QRCode from 'qrcode.react';
import Button from 'antd/lib/button';
import message from 'antd/lib/message';
import Header from '@components/header/Header';

import './index.less';
import { useEventListener } from '@Utils';
import FormItem from '@components/form-item';
import { Modal } from 'antd';
import { uploadCode } from '@api/BaseAPI';

const VerifyCodeLength = 6;
const MobileRegex = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
const sectionHeight = document.documentElement.clientHeight;
let lastTime = 0;
let lastTop = 0;

export default function HomePage(_: RouteComponentProps) {
  const {
    state: { user },
    dispatch,
  } = useAuth();

  const [mobile, setMobile] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [canLogin, setCanLogin] = useState(false);
  const [sectionIndex, setSectionIndex] = useState([]);
  const [isAgree, setIsAgree] = useState(false);
  const [verifyCodeDisableTime, setVerifyCodeDisableTime] = useState(0);
  const [isQrLogin, setIsQrLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginUrl, setLoginUrl] = useState('');
  const rcodeRef = useRef<any>();
  const timeoutRef = useRef<any>();
  const sectionRef = useRef([]);

  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    mobile: '',
    mail: '',
    desc: '',
    qualification: '',
  });
  const [validateMap, setValidateMap] = React.useState({
    mobile: false,
    mail: false,
    desc: false,
    qualification: false,
  });
  const [formValidate, setFormValidate] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  //登陆处理函数，成功跳转到首页，失败显示错误提示
  const handleSubmit = async () => {
    setLoading(true);
    const response: any = await login(mobile, verifyCode);
    const responseData: any = response.data;
    if (responseData.code === 200) {
      const { ticket } = responseData.data;
      let userInfo: any = await getCurrentUser(ticket);
      if (userInfo.data.data) {
        userInfo = userInfo.data.data;
      }
      setLoading(false);
      handleUserResponse(userInfo, dispatch);
    } else {
      message.error(responseData.msg);
      setLoading(false);
    }
  };

  const getVerifyCode = async () => {
    if (isQrLogin || verifyCodeDisableTime) return;

    if (!MobileRegex.test(mobile)) {
      return false;
    }
    setVerifyCodeDisableTime(60);
    const response = await sendSMSCode(mobile);
    const { code, msg } = response.data;
    if (code === 200) {
      message.success('验证码发送成功！');
    } else {
      message.error(msg);
    }
  };

  const initQrcode = async () => {
    if (timeoutRef.current) {
      stopQueryQrResult();
    }
    const res = await getQrcodeUrl();
    const { url, rcode } = res.data.data;
    setLoginUrl(url);
    rcodeRef.current = rcode;
    startQueryQrResult();
  };

  const startQueryQrResult = () => {
    timeoutRef.current = setTimeout(async () => {
      if (!rcodeRef.current) return;
      const response = await getQrcodeResult(rcodeRef.current);
      const { data } = response;
      if (data.code === 200) {
        stopQueryQrResult();
        handleUserResponse(data.data, dispatch);
        initQrcode();
      } else if (data.code === 26) {
        //message.error(data.msg);
        stopQueryQrResult();
        initQrcode();
      } else if (data.code === 203) {
        startQueryQrResult();
      }
    }, 2000);
  };

  const stopQueryQrResult = () => {
    clearTimeout(timeoutRef.current);
  };

  const handleMenuClick = (item) => {
    const isQr = item === 'qrcode';
    if (isQr) {
      initQrcode();
    } else {
      stopQueryQrResult();
    }
    setIsQrLogin(isQr);
  };

  const onDownLoadClick = () => {
    window.open('https://www.mgtv.com/app/');
  };

  const viewUserProtocol = () => {
    window.open('https://i.mgtv.com/account/c_protocol');
  };

  useEffect(() => {
    if (!user || !user.ticket) {
      initQrcode();
    } else {
      rcodeRef.current = null;
    }
  }, [user]);

  useEffect(() => {
    //获取验证码后60秒倒计时
    if (verifyCodeDisableTime) {
      setTimeout(() => {
        setVerifyCodeDisableTime(verifyCodeDisableTime - 1);
      }, 1000);
    }
  }, [verifyCodeDisableTime]);

  useEffect(() => {
    //根据填写的表单数据设置登录按钮状态
    let validate = false;
    if (!isQrLogin) {
      validate =
        MobileRegex.test(mobile) &&
        verifyCode.length === VerifyCodeLength &&
        isAgree;
    }
    setCanLogin(validate);
  }, [mobile, verifyCode, isAgree]);

  useEffect(() => {
    setTimeout(() => {
      document.querySelector('body').setAttribute('style', '');
    }, 500);
  }, []);

  const scrollListen = () => {
    const curTime = new Date().getTime();
    console.log(`curTime ${curTime} - lastTime ${lastTime}`);
    const curSelections = sectionRef.current;
    if (curTime - lastTime > 500) {
      if (window.scrollY) {
        const curIndex = Math.ceil(window.scrollY / sectionHeight);
        if (window.scrollY > lastTop) {
          if (!curSelections.includes(curIndex)) {
            sectionRef.current = [...curSelections, curIndex];
            setSectionIndex(sectionRef.current);
          }
          console.log(curIndex);
        } else {
          if (!curSelections.includes(curIndex)) {
            sectionRef.current = [...curSelections, curIndex];
            setSectionIndex(sectionRef.current);
          }
          console.log(curIndex - 1);
        }
        lastTop = window.scrollY;
        lastTime = curTime;
      }
    }
  };

  useEventListener('scroll', scrollListen);

  const loginTypeMenu = [
    {
      name: '扫码登录',
      key: 'qrcode',
    },
    {
      name: '手机登录',
      key: 'mobile',
    },
  ];

  const destroyModal = () => {
    setFormVisible(false);
  };

  const onConfirm = async () => {
    if (!formValidate) return;
    setFormLoading(true);
    const response = await uploadCode(formData);
    const { code, msg } = response.data;
    setFormLoading(false);
    if (code === 200) {
      message.success('资格申请提交成功！');
      setFormVisible(false);
    } else {
      message.error(msg || '添加失败，请检查表单信息是否正确！');
    }
  };

  const askPermission = () => {
    setFormData({
      mobile: '',
      mail: '',
      desc: '',
      qualification: '',
    });
    setValidateMap({
      mobile: false,
      mail: false,
      desc: false,
      qualification: false,
    });
    setFormValidate(false);
    setFormVisible(true);
  };

  const onFormItemChange = (model: string, value: any) => {
    const newFormData = { ...formData };
    newFormData[model] = value;
    setFormData(newFormData);
  };

  const onFormItemValidChange = (model: string, validate: boolean) => {
    const newValidateMap = { ...validateMap };
    newValidateMap[model] = validate;
    setValidateMap(newValidateMap);
    let newFormValidate = true;
    for (const key in newValidateMap) {
      if (!newValidateMap[key]) newFormValidate = false;
    }
    setFormValidate(newFormValidate);
  };

  const getFormModal = () => {
    return (
      <Modal
        wrapClassName={`form-modal ask-permission-form ${!formVisible ? 'hidden' : ''
          }`}
        title=""
        visible
        mask={formVisible}
        closable={false}
        width={840}
      >
        <div className="form-content-wrapper">
          <div className="title">内测资格申请</div>
          {formVisible ? (
            <div className="form-list">
              <FormItem
                params={{
                  model: 'mobile',
                  label: '手机号码',
                  type: 'mobile',
                  required: true,
                  value: formData.mobile,
                }}
                onChange={(value: any) => onFormItemChange('mobile', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('mobile', validate)
                }
              />
              <FormItem
                params={{
                  model: 'mail',
                  label: '邮箱',
                  type: 'mail',
                  required: true,
                  bottomTip: '申请结果将通过此邮箱进行通知',
                  value: formData.mail,
                }}
                onChange={(value: any) => onFormItemChange('mail', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('mail', validate)
                }
              />
              <FormItem
                params={{
                  model: 'desc',
                  label: '意向小程序介绍',
                  required: true,
                  bottomTip: '如：与综艺《明星大侦探》绑定的明侦线上小游戏',
                  value: formData.desc,
                }}
                onChange={(value: any) => onFormItemChange('desc', value)}
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('desc', validate)
                }
              />
              <FormItem
                params={{
                  model: 'qualification',
                  label: '开发者资质',
                  required: true,
                  value: formData.qualification,
                  bottomTip: '如：产品技术中心 前端开发 张三',
                }}
                onChange={(value: any) =>
                  onFormItemChange('qualification', value)
                }
                onFormItemValidChange={(validate: boolean) =>
                  onFormItemValidChange('qualification', validate)
                }
              />
            </div>
          ) : null}
          <div className="feedback">
            小程序开发过程遇到任何问题，请发送邮件至 mp@mgtv.com 进行反馈
          </div>
          <div className="buttons">
            <Button
              className="saveBtn middle-size"
              disabled={!formValidate}
              loading={formLoading}
              onClick={onConfirm}
            >
              确认
            </Button>
            <Button className="cancelBtn middle-size" onClick={destroyModal}>
              取消
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <>
      <div className="homepage-bg">
        <div className="homepage-wrapper">
          <div id="mapContainer"></div>
          <section className="homepage-section login-section">
            <div className="anchor-1"></div>
            <Header></Header>
            <div className="aurora--canvas content--canvas"></div>
            <div className="bg"></div>
            <div className="login-wrapper show">
              <div className="login-type-wrapper">
                {loginTypeMenu.map((item: any) => {
                  const isActive =
                    (isQrLogin && item.key === 'qrcode') ||
                    (!isQrLogin && item.key !== 'qrcode');
                  const navClass = isActive
                    ? 'login-type-nav active'
                    : 'login-type-nav';
                  return (
                    <div key={item.key}>
                      <nav
                        className={navClass}
                        onClick={() => handleMenuClick(item.key)}
                      >
                        {' '}
                        {item.name}
                      </nav>
                    </div>
                  );
                })}
              </div>
              {isQrLogin ? (
                <div className="qrcode-login-wrapper">
                  <div className="qrcode-wrapper">
                    <div className="logo"></div>
                    <QRCode value={loginUrl} size={136} fgColor="#000000" />
                  </div>
                  <span className="qrcode-login-tip">
                    请扫码进行登录
                  </span>
                  <span className="download-link" onClick={onDownLoadClick}>
                    下载
                  </span>
                </div>
              ) : (
                <div className="mobile-login-wrapper">
                  <div className="mobile-login-form">
                    <div className="mgui-cell">
                      <div className="cellsbox">
                        <div className="bd">
                          <input
                            className="input"
                            type="tel"
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="请输入手机号"
                            value={mobile}
                          />
                        </div>
                      </div>
                      <div className="cellsbox">
                        <div className="bd">
                          <input
                            className="input"
                            type="text"
                            onChange={(e) => setVerifyCode(e.target.value)}
                            placeholder="请输入验证码"
                            value={verifyCode}
                          />
                          <div className="ncode">
                            <div
                              className={`ncode-link ${verifyCodeDisableTime ||
                                !MobileRegex.test(mobile)
                                ? 'disable'
                                : ''
                                }`}
                              onClick={() => {
                                getVerifyCode();
                              }}
                            >
                              {verifyCodeDisableTime
                                ? `${verifyCodeDisableTime}s`
                                : '获取验证码'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="login-tips">
                        <div className="tips">
                          <div
                            className="deal"
                            onClick={() => setIsAgree(!isAgree)}
                          >
                            <label className={`${isAgree ? 'checked' : ''}`}>
                              {isAgree ? (
                                <i className="icon-select-on" />
                              ) : (
                                <i className="icon-select" />
                              )}
                              同意
                              <div className="link" onClick={viewUserProtocol}>
                                《用户协议》
                              </div>
                              <div className="link" onClick={viewUserProtocol}>
                                《隐私政策》
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="footer-wrapper">
                        <Button
                          loading={loading}
                          disabled={!canLogin}
                          onClick={handleSubmit}
                          className="saveBtn"
                        >
                          登录
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          <section className="homepage-section description-section">
            <div className="anchor-2"></div>
            <div className="shift--canvas content--canvas"></div>
            <div className="bg"></div>
            <div className="content">
              <div
                className={`description1 description ${sectionIndex.includes(1) ? 'show' : ''
                  }`}
              >
                基于<span className="bold">视频APP的轻量化小程序</span>
                解决方案，为
              </div>
              <div
                className={`description2 description ${sectionIndex.includes(1) ? 'show' : ''
                  }`}
              >
                视频内容
              </div>
              <div
                className={`description3 description ${sectionIndex.includes(1) ? 'show' : ''
                  }`}
              >
                拓展更多开放服务能力
              </div>
            </div>
          </section>
          <section className="homepage-section feature-section">
            <div className="anchor-3"></div>
            <div className="swirl--canvas content--canvas"></div>
            <div className="left part">
              <div className="bg"></div>
              <div className="content">
                <div
                  className={`description1 description ${sectionIndex.includes(2) ? 'show' : ''
                    }`}
                >
                  平台开放创新
                </div>
                <div
                  className={`description2 description ${sectionIndex.includes(2) ? 'show' : ''
                    }`}
                >
                  首家开放生态，视频行业独树一帜
                </div>
                <div
                  className={`description3 description ${sectionIndex.includes(2) ? 'show' : ''
                    }`}
                >
                  新的征程起航，迎着机遇乘风破浪
                </div>
              </div>
            </div>
            <div className="right">
              <div className="top part">
                <div className="bg"></div>
                <div className="content">
                  <div
                    className={`description1 description ${sectionIndex.includes(2) ? 'show' : ''
                      }`}
                  >
                    丰富渠道入口
                  </div>
                  <div
                    className={`description2 description ${sectionIndex.includes(2) ? 'show' : ''
                      }`}
                  >
                    随时扫码开始，一键生成分享物料
                  </div>
                  <div
                    className={`description3 description ${sectionIndex.includes(2) ? 'show' : ''
                      }`}
                  >
                    便捷标签搜索，内容关联智能推荐
                  </div>
                </div>
              </div>
              <div className="bottom part">
                <div className="bg"></div>
                <div className="content">
                  <div
                    className={`description1 description ${sectionIndex.includes(2) ? 'show' : ''
                      }`}
                  >
                    亿级流量共享
                  </div>
                  <div
                    className={`description2 description ${sectionIndex.includes(2) ? 'show' : ''
                      }`}
                  >
                    亿级用户平台，资源与您共享
                  </div>
                  <div
                    className={`description3 description ${sectionIndex.includes(2) ? 'show' : ''
                      }`}
                  >
                    用户持续增长，官方流量定向扶持
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="homepage-section eg-section">
            <div className="anchor-4"></div>
            <div className="pipeline--canvas content--canvas"></div>
            <div className="bg"></div>
            <div className="content">
              <div
                className={`description1 description ${sectionIndex.includes(3) ? 'show' : ''
                  }`}
              >
                场景案例
              </div>
              <div
                className={`description2 description ${sectionIndex.includes(3) ? 'show' : ''
                  }`}
              >
                在“轻服务”盛行的互联网时期，我们着眼于“内容+服务”的复合形式
              </div>
              <div
                className={`description3 description ${sectionIndex.includes(3) ? 'show' : ''
                  }`}
              >
                积极打造以视频为核心的内容生态
              </div>
            </div>
            <div className="cards">
              <div
                className={`card-wrapper card1 ${sectionIndex.includes(3) ? 'show' : ''
                  }`}
              >
                <div className="pic"></div>
                <div className="title">电商</div>
              </div>
              <div
                className={`card-wrapper card2 ${sectionIndex.includes(3) ? 'show' : ''
                  }`}
              >
                <div className="pic"></div>
                <div className="title">活动</div>
              </div>
              <div
                className={`card-wrapper card3 ${sectionIndex.includes(3) ? 'show' : ''
                  }`}
              >
                <div className="pic"></div>
                <div className="title">游戏</div>
              </div>
              <div
                className={`card-wrapper card4 ${sectionIndex.includes(3) ? 'show' : ''
                  }`}
              >
                <div className="pic"></div>
                <div className="title">服务</div>
              </div>
            </div>
          </section>
          <section className="homepage-section flow-section">
            <div className="anchor-5"></div>
            <div className="bg"></div>
            <div className="content-wapper">
              <div className="content">
                <div
                  className={`description1 description ${sectionIndex.includes(4) || sectionIndex.includes(5)
                    ? 'show'
                    : ''
                    }`}
                >
                  接入流程
                </div>
                <div
                  className={`flow-pic ${sectionIndex.includes(4) || sectionIndex.includes(5)
                    ? 'show'
                    : ''
                    }`}
                ></div>
                <div className="bottom-content">
                  <div className="links">
                    <div className="column">
                      <div className="column-content">
                        <span>开发文档</span>
                        <a
                          href="http://open.imgo.tv/doc/introduction"
                          target="_blank"
                        >
                          介绍
                        </a>
                        <a
                          href="http://open.imgo.tv/doc/develop"
                          target="_blank"
                        >
                          开发
                        </a>
                        <a
                          href="http://open.imgo.tv/doc/design"
                          target="_blank"
                        >
                          设计
                        </a>
                        <a
                          href="http://open.imgo.tv/doc/standard"
                          target="_blank"
                        >
                          规范
                        </a>
                      </div>
                    </div>
                    <div className="column">
                      <div className="column-content">
                        <span>营销推广</span>
                        <a>营销转化</a>
                        <a>流量支持</a>
                      </div>
                    </div>
                    <div className="column">
                      <div className="column-content">
                        <span>数据分析</span>
                        <a>数据概览</a>
                        <a>用户画像</a>
                        <a>营销分析</a>
                      </div>
                    </div>
                  </div>
                  <div className="qrcode-wrapper">
                    <div className="qrcode">
                      <div className="logo"></div>
                      <QRCode
                        value={'https://www.mgtv.com/app/'}
                        size={136}
                        fgColor="#000000"
                      />
                    </div>
                    <span className="qrcode-tip">扫一扫立即下载</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        {getFormModal()}
      </div>
    </>
  );
}
