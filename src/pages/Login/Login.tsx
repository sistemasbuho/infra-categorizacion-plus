import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { decodedToken } from './utils/isValidToken';
import { useAuth } from '../../shared/auth/AuthContext';
import { setLogin } from '../../shared/utils/funcs';

export const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLoginSuccess = (resp: CredentialResponse) => {
    const jwt = resp.credential!;
    const decoded = decodedToken(jwt);

    const session = { access: jwt, ...decoded };

    setLogin(session);

    setUser(session);

    navigate('/');
  };

  const handleLoginFailure = () => {
    console.error('Login Failure:');
  };

  return (
    <section className="p-4 min-h-screen bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] flex items-center justify-center">
      <div
        className="text-center text-white space-y-8 flex items-center justify-center flex-col lg:flex-row gap-9
      "
      >
        <div>
          <h1 className="text-2xl md:text-5xl font-extrabold mb-4">
            Módulo de Categorización
          </h1>

          <p className="text-xl">
            Para comenzar a utilizar la aplicación, primero inicie sesión.
          </p>
        </div>

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
      </div>
    </section>
  );
};
