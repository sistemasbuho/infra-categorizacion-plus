import { decodedTokenInLocalStorage } from './components/Login/isValidToken';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider } from './context/ConfigContext';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'react-hot-toast';

import GlobalComponent from './GlobalComponent';
import Home from './pages/Home';
import Login from './components/Login/Login';
import styles from './assets/css/general.module.css';

function App() {
  const [showLogin, setshowLogin] = useState<boolean | null>(null);
  const [ancho, setAncho] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setAncho(window.innerWidth);

    window.addEventListener('resize', handleResize);

    if (ancho <= 1500) {
      document.getElementById('root').classList.add(`${styles.zoom70}`);
    } else {
      document.getElementById('root').classList.remove(`${styles.zoom70}`);
    }
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [ancho]);

  useEffect(() => {
    const token = decodedTokenInLocalStorage();

    token ? setshowLogin(false) : setshowLogin(true);
    return () => {};
  }, []);

  return (
    <ConfigProvider>
      <Toaster
        position="bottom-left"
        toastOptions={{
          success: {
            icon: <FontAwesomeIcon icon={faCircleCheck} fontSize={25} />,
            style: {
              padding: '1rem',
              border: '2px solid var(--border-toast-succes)',
              color: 'var(--color-toast-succes)',
              backgroundColor: 'var(--bg-toast-succes)',
            },
          },
          error: {
            icon: <FontAwesomeIcon icon={faCircleCheck} fontSize={25} />,
            style: {
              padding: '1rem',
              border: '2px solid var(--border-toast-error)',
              color: 'var(--color-toast-error)',
              backgroundColor: 'var(--bg-toast-error)',
            },
          },
        }}
      />

      {showLogin && <Login setShow={setshowLogin} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articulo/:id" element={<GlobalComponent />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
