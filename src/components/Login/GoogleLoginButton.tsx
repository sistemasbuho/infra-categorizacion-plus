import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from '@react-oauth/google';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  setShow: Dispatch<SetStateAction<boolean>>;
}

function GoogleLoginButton({ setShow }: Props) {
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    localStorage.setItem(
      'token',
      JSON.stringify(credentialResponse.credential)
    );

    setShow(false);
  };

  const handleLoginFailure = () => {
    console.error('Login Failure:');
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
