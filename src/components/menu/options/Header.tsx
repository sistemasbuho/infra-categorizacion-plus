import { Autores, GeneralOption, Medios } from '../../../interfaces/generals';
import { useEffect, useState } from 'react';
import { useArticleContext } from '../../../context/ArticleContext';
import { postHeader } from '../../../utils/asyncFunc';
import { Box, Field, Input } from '@chakra-ui/react';

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

  function validateForm() {
    if (tipoOption === null) return toast.error('Tipo no seleccionado');
    if (fechaOption === null) return toast.error('Fecha no seleccionada');
    if (medioOption === null) return toast.error('Medio no seleccionado');
    if (autorOption === null) return toast.error('Autor no seleccionado');
  }

  async function sendHeaderCategorization(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    validateForm();

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
        ).map((item) => (item.isNew ? item?.nombre : item?.id)),
      };

      if (
        !tipoOption?.id ||
        fullDate.length <= 0 ||
        medioOption.length <= 0 ||
        autorOption.length <= 0
      ) {
        return toast.error('Faltan campos por diligenciar');
      }

      return await postHeader(articulo.id, update)
        .then((res) => {
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
        })
        .catch((err) => {
          console.error(err);
          toast.error('Ocurrió un error');
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
    <Box>
      <Box mb={4}>
        <form
          id="header-form"
          onSubmit={sendHeaderCategorization}
          style={{ width: '100%' }}
        >
          <Field.Root>
            <Field.Label>
              Tipo
              <Field.RequiredIndicator />
            </Field.Label>
            <Select
              options={tipos}
              getOptionLabel={(e: GeneralOption) => e.nombre}
              getOptionValue={(e: GeneralOption) => e.id.toString()}
              value={tipoOption}
              onChange={(e) => setTipoOption(e as GeneralOption)}
              styles={{
                container: (base) => ({
                  ...base,
                  width: '100%',
                }),
              }}
            />
            <Field.HelperText />
            <Field.ErrorText />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              Fecha
              <Field.RequiredIndicator />
            </Field.Label>
            <Input
              px={2}
              border={'1px solid hsl(0, 0%, 80%)'}
              type="datetime-local"
              value={fechaOption}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setfechaOption(e.target.value)
              }
            />
            <Field.HelperText />
            <Field.ErrorText />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              Medio
              <Field.RequiredIndicator />
            </Field.Label>
            <AsyncSelectMedio sendResponse={getMedio} value={articulo.medio} />
            <Field.HelperText />
            <Field.ErrorText />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              Programa
              <Field.RequiredIndicator />
            </Field.Label>
            <Select
              options={programas}
              getOptionLabel={(e: GeneralOption) => e.nombre}
              getOptionValue={(e: GeneralOption) => e.id.toString()}
              value={programaOption}
              onChange={(e) => setProgramaOption(e as GeneralOption)}
              styles={{
                container: (base) => ({
                  ...base,
                  width: '100%',
                }),
              }}
            />
            <Field.HelperText />
            <Field.ErrorText />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              Autor
              <Field.RequiredIndicator />
            </Field.Label>
            <AsyncSelectAutor sendResponse={getAutor} value={articulo.autor} />

            <Field.HelperText />
            <Field.ErrorText />
          </Field.Root>
        </form>
      </Box>
      <ButtonControls form="header-form" />
    </Box>
  );
}

export default Header;
