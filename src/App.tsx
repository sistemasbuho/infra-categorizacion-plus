import { decodedTokenInLocalStorage } from './components/Login/isValidToken';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider } from './context/ConfigContext';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { userRoutes } from './routes';
import { Toaster } from 'react-hot-toast';
import { VStack } from '@chakra-ui/react';

import Login from './components/Login/Login';
import Sidebar from './components/Sidebar';
import { useColorMode } from './components/ui/color-mode';

function App() {
  const [showLogin, setshowLogin] = useState<boolean | null>(null);
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('light');
    const token = decodedTokenInLocalStorage();

    token ? setshowLogin(false) : setshowLogin(true);
  }, []);

  return (
    <VStack>
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
          <Sidebar>
            <Routes>
              {userRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </Sidebar>
        </BrowserRouter>
      </ConfigProvider>
    </VStack>
  );
}

export default App;
