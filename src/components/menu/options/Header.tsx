import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';
import { postHeader } from '../../../utils/asyncFunc';
import { useState } from 'react';
import {
  headerArticle,
  Programas,
  SelectOption,
  Tipos,
} from '../../../interfaces/generals';

import AsyncSelectMedio from '../../asyncSelects/AsyncSelectMedio';
import AsyncSelectAutor from '../../asyncSelects/AsyncSelectAutor';
import ButtonControls from '../../controls/ButtonControls';
import Select from 'react-select';

interface Props {
  articulo: headerArticle;
  tipos: Tipos[];
  programas: Programas[];
}

function Header({ articulo, tipos, programas }: Props) {
  const [programaOption, setProgramaOption] = useState<SelectOption>({
    label: articulo.programa?.nombre,
    value: articulo.programa?.id,
  });
  const [tipoOption, setTipoOption] = useState<SelectOption>({
    label: articulo.tipo_articulo?.nombre,
    value: articulo.tipo_articulo?.id,
  });
  const [fechaOption, setfechaOption] = useState(articulo.fecha);
  const [autorOption, setAutorOption] = useState<SelectOption | null>({
    label: articulo.autor.nombre,
    value: articulo.autor.id,
  });
  const [medioOption, setMedioOption] = useState<SelectOption | null>({
    label: articulo.medio.nombre,
    value: articulo.medio.id,
  });
  async function sendHeaderCategorization(e: React.FormEvent) {
    e.stopPropagation();
    e.preventDefault();

    const time = new Date(fechaOption).toLocaleTimeString();
    const date = new Date(fechaOption)
      .toLocaleDateString()
      .split('/')
      .reverse()
      .join('-');

    const fullDate = `${date} ${time}`;

    const update = {
      articulo_id: articulo.id,
      tipo_articulo_id: tipoOption.value,
      programa_id: programaOption.value,
      fecha: fullDate,
      medio_id: [
        medioOption[0].isNew ? medioOption[0].nombre : medioOption[0].id,
      ],
      autor_id: [autorOption[0].nombre],
    };

    return await postHeader(articulo.id, update);
  }

  function getMedio(option) {
    setMedioOption(option);
  }

  function getAutor(option) {
    setAutorOption(option);
  }

  return (
    <>
      <div>
        <h2>ENCABEZADO</h2>
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
      </div>
      <div>
        <Form id="header-form" onSubmit={sendHeaderCategorization}>
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
            <AsyncSelectMedio sendResponse={getMedio} />
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
            <AsyncSelectAutor sendResponse={getAutor} />
          </Form.Group>
        </Form>
      </div>
      <ButtonControls form="header-form" />
    </>
  );
}

export default Header;
