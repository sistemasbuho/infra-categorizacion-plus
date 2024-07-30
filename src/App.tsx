import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ConfigProvider } from './context/ConfigContext';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Toaster } from 'react-hot-toast';
// import { useEffect } from 'react';
// import { decodedToken } from './components/Login/isValidToken';

import GlobalComponent from './GlobalComponent';
import Home from './pages/Home';

function App() {
  // const [showLoginView, setshowLoginView] = useState<boolean>(false);
  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   if (!token) {
  //     setshowLoginView(true);
  //   }

  //   if (token) {
  //     const decoded = decodedToken(token);

  //     console.log(`Email: ${decoded.email}`);
  //   }
  //   return () => {};
  // }, []);

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

      {/* {showLoginView && <Login setShow={setshowLoginView} />} */}
      {/* {!showLoginView && ( */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articulo/:id" element={<GlobalComponent />} />
        </Routes>
      </BrowserRouter>
      {/* )} */}
    </ConfigProvider>
  );
}

export default App;
