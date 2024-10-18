import React from 'react';
import { GoogleLogin as ReactGoogleLogin } from 'react-google-login';
import { Button } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';

interface GoogleLoginProps {
  onSuccess: (response: any) => void;
}

export default function GoogleLogin({ onSuccess }: GoogleLoginProps) {
  const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID

  return (
    <ReactGoogleLogin
      clientId={clientId}
      render={renderProps => (
        <Button onClick={renderProps.onClick} disabled={renderProps.disabled} icon={<GoogleOutlined />}>
          Login with Google
        </Button>
      )}
      onSuccess={onSuccess}
      onFailure={(error) => console.error('Google Login Failed:', error)}
      cookiePolicy={'single_host_origin'}
    />
  );
}