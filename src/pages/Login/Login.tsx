import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { decodedToken } from '../components/Login/isValidToken';
import { setLogin } from '../utils/funcs';

export const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (resp: CredentialResponse) => {
    const jwt = resp.credential!;
    const decoded = decodedToken(jwt);

    // Crea el objeto de sesión: acceso + datos decodificados (incluye grupos, cliente, ...)
    const session = { access: jwt, ...decoded };

    console.log({ jwt, decoded, session });

    // Guarda cifrado en localStorage via funcs.setLogin
    setLogin(session);

    // Redirige al home
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

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            auto_select={true}
            useOneTap={true}
          />
        </GoogleOAuthProvider>

        {/* <div className="bg-white p-8 rounded-xl shadow-xl w-96 mx-auto">
          <form id="login" onSubmit={onLogin} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="username"
                {...register('username', {
                  required: 'El nombre no puede estar vacío',
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                {...register('password', {
                  required: 'La contraseña no es válida',
                })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition"
            >
              Iniciar sesión
            </button>
          </form>
        </div> */}
      </div>
    </section>
  );
};
