import React from 'react';
import ReactAppleLogin from 'react-apple-login';
import { Button } from 'antd';
import { AppleOutlined } from '@ant-design/icons';

interface AppleLoginProps {
  onSuccess: (response: any) => void;
}

export default function AppleLogin({ onSuccess }: AppleLoginProps) {
  const clientId = 'YOUR_APPLE_CLIENT_ID'; // Replace with your actual client ID

  return (
    <ReactAppleLogin
      clientId={clientId}
      redirectURI="https://your-redirect-url.com"
      render={renderProps => (
        <Button onClick={renderProps.onClick} icon={<AppleOutlined />}>
          Login with Apple
        </Button>
      )}
      callback={onSuccess}
    />
  );
}