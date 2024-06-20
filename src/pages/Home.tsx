import { useState } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function Home(): React.ReactElement {
  const [input, setInput] = useState('1204095');
  const navigate = useNavigate();
  const goToCategorization = () => {
    navigate(`articulo/${input}`);
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center gap-3"
      style={{ height: '100vh' }}
    >
      <h1>Modulo de Categorization</h1>
      <h3>Clarity 2.0</h3>
      <span className="text-bg-info">1204095</span>
      <div>
        <form className="d-flex gap-3" onSubmit={goToCategorization}>
          <FormControl
            type="text"
            placeholder="Buscar"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button
            className="btn btn-outline-success bg-transparent"
            type="submit"
          >
            Buscar
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Home;
