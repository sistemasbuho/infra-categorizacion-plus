import { useState } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function Home(): React.ReactElement {
  const [input, setInput] = useState('');
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
      <div className="d-flex gap-3 ">
        <FormControl
          type="text"
          placeholder="Buscar"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button
          className=" btn btn-outline-success bg-transparent"
          onClick={goToCategorization}
        >
          Buscar
        </Button>
      </div>
    </div>
  );
}

export default Home;
