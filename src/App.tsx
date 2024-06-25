import { ConfigProvider } from './context/ConfigContext';
import { ArticleProvider } from './context/ArticleContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalComponent from './GlobalComponent';
import Home from './pages/Home';

function App() {
  return (
        <BrowserRouter>
    <ConfigProvider>
      <ArticleProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Home />} />
            <Route path="/articulo/:id" element={<GlobalComponent />} />
          </Routes>
      </ArticleProvider>
    </ConfigProvider>
        </BrowserRouter>
  );
}

export default App;
