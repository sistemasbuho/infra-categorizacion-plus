import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from '@react-oauth/google';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodedToken } from './isValidToken';
import { setLogin } from '../../utils/funcs';
import { useAuth } from '../../auth/AuthContext';

interface Props {
  setShow: Dispatch<SetStateAction<boolean>>;
}

function GoogleLoginButton({ setShow }: Props) {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    const jwt = credentialResponse.credential!;
    const decoded = decodedToken(jwt);

    const session = { access: jwt, ...decoded };

    setLogin(session);

    setUser(session);

    setShow(false);

    navigate('/');
  };

  const handleLoginFailure = () => {
    console.error('Login Failure:');
  };

  return (
    <GoogleOAuthProvider
      clientId={(import.meta as any).env.VITE_GOOGLE_CLIENT_ID}
    >
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        auto_select={false}
        useOneTap={false}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;
