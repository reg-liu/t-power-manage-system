export const handleGoogleLogin = (response: any) => {
  if (response.profileObj) {
    const { googleId, name, email } = response.profileObj;
    console.log('Google login successful:', { googleId, name, email });
    // Here you would typically call your API to log in with the received user info
  } else {
    console.error('Google login failed:', response);
  }
};

export const handleAppleLogin = (response: any) => {
  if (response.authorization) {
    const { id_token, state } = response.authorization;
    console.log('Apple login successful:', { id_token, state });
    // Here you would typically call your API to log in with the received user info
  } else {
    console.error('Apple login failed:', response);
  }
};