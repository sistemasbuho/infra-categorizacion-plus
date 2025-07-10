import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import useToken from './hooks/useToken';
import Sidebar from './components/Sidebar';
import { routes } from './routes/routes';
import { ProtectedRoutes } from './auth/ProtectedRoutes';
import Home from './pages/Home/Home';
import { Login } from './pages/Login/Login';

function App() {
  const { token } = useToken();

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{
          success: {
            icon: <FontAwesomeIcon icon={faCircleCheck} fontSize={25} />,
            style: {
              padding: '1rem',
              border: '2px solid #00ada1',
              color: '#fff',
              backgroundColor: '#00ada1',
            },
          },
          error: {
            icon: <FontAwesomeIcon icon={faCircleCheck} fontSize={25} />,
            style: {
              padding: '1rem',
              border: '2px solid #ff7588',
              color: '#fff',
              backgroundColor: '#ff7588',
            },
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          {token ? (
            // Usuario autenticado: mostrar todas las rutas protegidas
            <Route element={<Sidebar />}>
              <Route path="/" element={<Home />} />
              {routes.map((r) => (
                <Route
                  key={r.path}
                  path={r.path}
                  element={
                    <ProtectedRoutes roles={r.roles}>
                      <r.element />
                    </ProtectedRoutes>
                  }
                />
              ))}
            </Route>
          ) : (
            // Usuario no autenticado: solo login
            <>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
