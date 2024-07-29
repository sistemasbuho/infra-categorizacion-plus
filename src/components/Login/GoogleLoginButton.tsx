import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from '@react-oauth/google';

function GoogleLoginButton() {
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    console.log('Login Success:', credentialResponse);
  };

  const handleLoginFailure = () => {
    console.error('Login Failure:');
  };

  return (
    <GoogleOAuthProvider clientId="976472882522-jfcok79uuii12i78tv4nkvs52g2ismuc.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        auto_select={true}
        useOneTap={true}
        
        
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;
