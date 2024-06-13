import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

import optionStyles from '../../../assets/css/components/menu/options.module.css';
import Select from 'react-select';

function Header() {
  return (
    <>
      <div>
        <h2>ENCABEZADO</h2>
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
      </div>
      <div>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Tipo</h4>
            </Form.Label>
            <Select />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Fecha</h4>
            </Form.Label>
            <Select />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Medio</h4>
            </Form.Label>
            <Select />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Programa</h4>
            </Form.Label>
            <Select />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Autor</h4>
            </Form.Label>
            <Select />
          </Form.Group>
        </Form>
      </div>

      <div className={optionStyles.controls}>
        <button className={optionStyles.reject}>Eliminar</button>
        <button className={optionStyles.accept}>Guardar</button>
      </div>
    </>
  );
}

export default Header;
