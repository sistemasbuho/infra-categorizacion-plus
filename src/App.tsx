import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GlobalComponent from './GlobalComponent';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articulo/:id" element={<GlobalComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
