import { Form } from 'react-bootstrap';
import { postHeader } from '../../../utils/asyncFunc';
import { useEffect, useState } from 'react';
import { GeneralOption } from '../../../interfaces/generals';
import { useArticleContext } from '../../../context/ArticleContext';

import AsyncSelectMedio from '../../asyncSelects/AsyncSelectMedio';
import AsyncSelectAutor from '../../asyncSelects/AsyncSelectAutor';
import ButtonControls from '../../controls/ButtonControls';
import Select from 'react-select';
import toast from 'react-hot-toast';

function Header() {
  const { article, setArticle } = useArticleContext().articleState;

  const { articulo } = article;
  const { programa: programas, tipo: tipos } =
    useArticleContext().articleState.article.forms_data;

  const [programaOption, setProgramaOption] = useState<GeneralOption | null>(
    articulo.programa
  );

  const [tipoOption, setTipoOption] = useState<GeneralOption | null>(
    articulo.tipo_articulo
  );

  const [fechaOption, setfechaOption] = useState<string | null>(
    articulo?.fecha ? articulo.fecha : null
  );

  const [autorOption, setAutorOption] = useState<GeneralOption | null>(
    articulo.autor
  );

  const [medioOption, setMedioOption] = useState<GeneralOption | null>(
    articulo.medio
  );

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
      articulo_id: articulo?.id,
      tipo_articulo_id: tipoOption?.id,
      programa_id: programaOption?.id,
      fecha: fullDate,
      medio_id: [
        medioOption[0]?.isNew ? medioOption[0]?.nombre : medioOption[0]?.id,
      ],
      autor_id: [autorOption[0]?.nombre],
    };

    if (
      !tipoOption?.id ||
      !programaOption?.id ||
      fullDate.length <= 0 ||
      [medioOption[0].isNew ? medioOption[0].nombre : medioOption[0].id]
        .length <= 0 ||
      [autorOption[0].nombre].length <= 0
    ) {
      return toast.error('Faltan campos por diligenciar');
    }
    return await postHeader(articulo.id, update).then((res) => {
      const { medio, programa, fecha, tipo_articulo, autor } = res.data;

      setArticle((prev) => ({
        ...prev,
        articulo: {
          ...prev.articulo,
          medio,
          programa,
          fecha,
          tipo_articulo,
          autor,
        },
      }));

      toast.success('Encabezado guardado');
    });
  }

  useEffect(() => {
    return () => {};
  }, [article]);

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
      </div>
      <div className="mb-4">
        <Form id="header-form" onSubmit={sendHeaderCategorization}>
          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Tipo</h4>
            </Form.Label>
            <Select
              options={tipos}
              getOptionLabel={(e: GeneralOption) => e.nombre}
              getOptionValue={(e: GeneralOption) => e.id.toString()}
              value={tipoOption}
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
            <AsyncSelectMedio
              sendResponse={getMedio}
              value={[articulo.medio]}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="tipo">
              <h4>Programa</h4>
            </Form.Label>
            <Select
              options={programas}
              getOptionLabel={(e: GeneralOption) => e.nombre}
              getOptionValue={(e: GeneralOption) => e.id.toString()}
              value={programaOption}
              onChange={(e) => setProgramaOption(e)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="tipo">
              <h4>Autor</h4>
            </Form.Label>
            <AsyncSelectAutor
              sendResponse={getAutor}
              value={[articulo.autor]}
            />
          </Form.Group>
        </Form>
      </div>
      <ButtonControls form="header-form" />
    </>
  );
}

export default Header;
