import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';

import GlobalComponent from './GlobalComponent';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function App() {
  return (
    <ConfigProvider>
      <Toaster
        position="bottom-left"
        toastOptions={{
          success: {
            icon: <FontAwesomeIcon icon={faCircleCheck} fontSize={25} />,
          },
          error: {
            icon: <FontAwesomeIcon icon={faCircleCheck} fontSize={25} />,
          },
          style: {
            padding: '1rem',
            border: '2px solid var(--border-toast-succes)',
            color: 'var(--color-toast-succes)',
            backgroundColor: 'var(--bg-toast-succes)',
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<Home />} />
          <Route path="/articulo/:id" element={<GlobalComponent />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
