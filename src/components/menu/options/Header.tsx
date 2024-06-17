import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

import optionStyles from '../../../assets/css/components/menu/options.module.css';
import Select from 'react-select';
import { headerArticle } from '../../../interfaces/generals';
import { useState } from 'react';

interface Props {
  articulo: headerArticle;
}

function Header({ articulo }: Props) {
  // const [medioOption, setMedioOption] = useState(articulo.medio);
  const [medioOption] = useState(articulo.medio);
  const [programaOption, setProgramaOption] = useState(articulo.programa);
  // const [tipoOption, settipoOption] = useState(articulo.tipo_articulo);
  const [tipoOption] = useState(articulo.tipo_articulo);
  const [fechaOption, setfechaOption] = useState(articulo.fecha);
  // const [autorOption, setAutoroption] = useState(articulo.autor);
  const [autorOption] = useState(articulo.autor);

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
            <Select defaultValue={{ label: tipoOption, value: tipoOption }} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Fecha</h4>
            </Form.Label>
            <input
              className="form-control"
              type="datetime-local"
              value={fechaOption}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setfechaOption(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Medio</h4>
            </Form.Label>
            <Select
              defaultValue={{
                label: medioOption.nombre,
                value: medioOption.id,
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Programa</h4>
            </Form.Label>
            <Select
              onChange={(e) => setProgramaOption(e.value)}
              defaultValue={{
                label: programaOption,
                value: programaOption,
              }}
            />{' '}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Autor</h4>
            </Form.Label>
            <Select
              defaultValue={{
                label: autorOption.nombre,
                value: autorOption.id,
              }}
            />
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
