import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

import optionStyles from '../../../assets/css/components/menu/options.module.css';
import Select from 'react-select';
import {
  headerArticle,
  Programas,
  SelectOption,
  Tipos,
} from '../../../interfaces/generals';
import { useState } from 'react';

interface Props {
  articulo: headerArticle;
  tipos: Tipos[];
  programas: Programas[];
}

function Header({ articulo, tipos, programas }: Props) {
  const [medioOption] = useState({
    label: articulo.medio?.nombre,
    value: articulo.medio?.id,
  });
  const [programaOption, setProgramaOption] = useState<SelectOption>({
    label: articulo.programa?.nombre,
    value: articulo.programa?.id,
  });
  const [tipoOption, setTipoOption] = useState<SelectOption>({
    label: articulo.tipo_articulo?.nombre,
    value: articulo.tipo_articulo?.id,
  });
  const [fechaOption, setfechaOption] = useState(articulo.fecha);
  const [autorOption] = useState<SelectOption>({
    label: articulo.autor?.nombre,
    value: articulo.autor?.id,
  });

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
            <Select
              options={tipos.map((item) => ({
                label: item.nombre,
                value: item.id,
              }))}
              defaultValue={tipoOption}
              onChange={(e) => setTipoOption(e)}
            />
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
            <Select defaultValue={medioOption} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Programa</h4>
            </Form.Label>
            <Select
              options={programas.map((item) => ({
                label: item.nombre,
                value: item.id,
              }))}
              defaultValue={programaOption}
              onChange={(e) => setProgramaOption(e)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Autor</h4>
            </Form.Label>
            <Select defaultValue={autorOption} />
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
