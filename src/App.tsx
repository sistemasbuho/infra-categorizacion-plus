import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';

import GlobalComponent from './GlobalComponent';
import Home from './pages/Home';

function App() {
  return (
    <ConfigProvider>
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
