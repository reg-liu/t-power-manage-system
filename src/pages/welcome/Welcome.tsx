import React, { useEffect, useState } from 'react';
import { Card, Tabs, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { GoogleLogin } from 'react-google-login';
import AppleLogin from 'react-apple-login';
import { handleGoogleLogin, handleAppleLogin } from './socialLogin';
import CircuitAnimation from './CircuitAnimation';
import './index.less';

const { TabPane } = Tabs;

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('email');
  const [visible, setVisible] = useState(true);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [isRegistering, setIsRegistering] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Received values of form: ', values);
    // Here you would typically call your API to log in or register
    message.success('Login successful!');
  };

  const sendVerification = (type: 'email' | 'phone') => {
    const value = form.getFieldValue(type);
    if (!value) {
      message.error(`Please enter your ${type} first.`);
      return;
    }
    message.info(`Verification ${type === 'email' ? 'email' : 'code'} sent to ${value}!`);
  };

  useEffect(() => {
    setFadeClass('fade-in'); // 重新显示元素时设置fade-in
    const intervalId = setInterval(() => {
      // 先设置为fade-out，2秒后再隐藏元素
      setFadeClass('fade-out');
      setTimeout(() => {
        setVisible(false);
      }, 2000); // 2秒后隐藏元素
      setTimeout(() => {
        setVisible(true);
        setFadeClass('fade-in'); // 重新显示元素时设置fade-in
      }, 4000); // 1秒后重新显示
    }, 11000); // 每8秒执行

    return () => clearInterval(intervalId); // 清理interval
  }, []);


  return (
    <div className="outer-container min-h-screen flex flex-col items-center justify-center bg-gray-100 relative overflow-hidden">
      { 
        visible && (
        <div className={`polling-element ${fadeClass}`}>
          <CircuitAnimation />
        </div>
        )
      }
      <h1 className="title text-6xl font-bold z-10">
        T-POWER
      </h1>
      <Card className="login-container shadow-lg z-10 overflow-auto">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Email" key="email">
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              {isRegistering && (
                <>
                  <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={() => sendVerification('email')}>Send Verification Email</Button>
                  </Form.Item>
                </>
              )}
              {!isRegistering && (
                <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  {isRegistering ? 'Register' : 'Log in'}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Phone" key="phone">
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item name="phone" rules={[{ required: true, message: 'Please input your phone number!' }]}>
                <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
              </Form.Item>
              {isRegistering && (
                <>
                  <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                  </Form.Item>
                  <Form.Item>
                    <Button onClick={() => sendVerification('phone')}>Send Verification Code</Button>
                  </Form.Item>
                </>
              )}
              {!isRegistering && (
                <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                </Form.Item>
              )}
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  {isRegistering ? 'Register' : 'Log in'}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
        <div className="text-center mt-4">
          <Button type="link" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Back to Login' : 'Register Now'}
          </Button>
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <GoogleLogin
            clientId="YOUR_GOOGLE_CLIENT_ID"
            render={renderProps => (
              <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                Google
              </Button>
            )}
            onSuccess={handleGoogleLogin}
            onFailure={handleGoogleLogin}
            cookiePolicy={'single_host_origin'}
          />
          <AppleLogin
            clientId="YOUR_APPLE_CLIENT_ID"
            redirectURI="https://your-redirect-uri.com"
            render={renderProps => (
              <Button onClick={renderProps.onClick}>
                Apple
              </Button>
            )}
            callback={handleAppleLogin}
          />
        </div>
      </Card>
    </div>
  );
}