import { Form } from 'react-bootstrap';
import { postHeader } from '../../../utils/asyncFunc';
import { useEffect, useState } from 'react';
import { Autores, GeneralOption, Medios } from '../../../interfaces/generals';
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

  const [programaOption, setProgramaOption] = useState<
    GeneralOption | undefined
  >(articulo.programa);
  const [tipoOption, setTipoOption] = useState<GeneralOption | undefined>(
    articulo.tipo_articulo
  );
  const [fechaOption, setfechaOption] = useState<string | undefined>(
    articulo?.fecha && articulo.fecha
  );
  const [autorOption, setAutorOption] = useState<Autores[]>(
    Array.isArray(articulo.autor) ? articulo.autor : [articulo.autor]
  );
  const [medioOption, setMedioOption] = useState<Medios[]>(
    Array.isArray(articulo.medio) ? articulo.medio : [articulo.medio]
  );

  async function sendHeaderCategorization(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    if (fechaOption) {
      const time = new Date(fechaOption).toLocaleTimeString('es-CO', {
        hour12: false,
      });
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
        medio_id: (Array.isArray(medioOption)
          ? medioOption
          : [medioOption]
        ).map((item) => item.id),
        autor_id: (Array.isArray(autorOption)
          ? autorOption
          : [autorOption]
        ).map((item) => item.id),
      };

      if (
        !tipoOption?.id ||
        !programaOption?.id ||
        fullDate.length <= 0 ||
        medioOption.length <= 0 ||
        autorOption.length <= 0
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
  }

  useEffect(() => {
    return () => {};
  }, [article]);

  function getMedio(option: Medios[]) {
    setMedioOption(option);
  }

  function getAutor(option: Autores[]) {
    setAutorOption(option);
  }

  return (
    <div>
      <div className="mb-3">
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
              onChange={(e) => setTipoOption(e as GeneralOption)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="fecha">
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
            <Form.Label htmlFor="medio">
              <h4>Medio</h4>
            </Form.Label>
            <AsyncSelectMedio sendResponse={getMedio} value={articulo.medio} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label htmlFor="programa">
              <h4>Programa</h4>
            </Form.Label>
            <Select
              options={programas}
              getOptionLabel={(e: GeneralOption) => e.nombre}
              getOptionValue={(e: GeneralOption) => e.id.toString()}
              value={programaOption}
              onChange={(e) => setProgramaOption(e as GeneralOption)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="autor">
              <h4>Autor</h4>
            </Form.Label>
            <AsyncSelectAutor sendResponse={getAutor} value={articulo.autor} />
          </Form.Group>
        </Form>
      </div>
      <ButtonControls form="header-form" />
    </div>
  );
}

export default Header;
