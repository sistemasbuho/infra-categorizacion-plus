import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalComponent from './GlobalComponent';
import Home from './pages/Home';
import { ConfigProvider } from './context/ConfigContext';
import { ArticleProvider } from './context/ArticleContext';

function App() {
  return (
    <ConfigProvider>
      <ArticleProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<Home />} />
            <Route path="/articulo/:id" element={<GlobalComponent />} />
          </Routes>
        </BrowserRouter>
      </ArticleProvider>
    </ConfigProvider>
  );
}

export default App;
