import { GeneralOption } from '../../../../interfaces/generals';
import {
  postArticleCategorization,
  deleteArticleCategorization,
} from '../../../../utils/asyncFunc';
import { useArticleContext } from '../../../../context/ArticleContext';

// import Select from 'react-select';
import toast from 'react-hot-toast';
import { useState } from 'react';
// import ButtonControls from '../../../controls/ButtonControls';
function GeneralForm() {
  // Context
  const { setArticle } = useArticleContext().articleState;
  const { articulo, forms_data } = useArticleContext().articleState.article;

  interface FormData {
    tema: number[];
    tag: number[];
  }

  // article
  const [temaGeneral, setTemaGeneral] = useState<GeneralOption[]>(
    forms_data.general.tema
  );
  const [tagGeneral, setTagGeneral] = useState<GeneralOption[]>(
    forms_data.general.tag
  );

  async function sendArticleCategorization(e: React.FormEvent) {
    e.preventDefault();
    const update: FormData = {
      tema: temaGeneral && temaGeneral.map((e) => e.id),
      tag: tagGeneral && tagGeneral.map((e) => e.id),
    };

    await postArticleCategorization(articulo.id, update)
      .then(() => {
        setArticle((prev) => ({
          ...prev,
          forms_data: {
            ...prev.forms_data,
            general: {
              tag: tagGeneral,
              tema: temaGeneral,
            },
          },
        }));

        toast.success('Categorización general guardada');
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message);
      });
  }

  async function deleteArticleCategorizaion() {
    await deleteArticleCategorization(articulo.id)
      .then(() => {
        setTemaGeneral([]);
        setTagGeneral([]);
        setArticle((prev) => ({
          ...prev,
          forms_data: {
            ...prev.forms_data,
            general: {
              tag: [],
              tema: [],
            },
          },
        }));
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div>
      {/* <form id="article-form" onSubmit={sendArticleCategorization}>
        <VStack display={'flex'} flexDir={'column'} gap={4}>
          <Field.Root>
            <Field.Label>Asignar tags al artículo</Field.Label>
            <Select
              isMulti
              value={tagGeneral}
              options={forms_data.tags}
              getOptionLabel={(e) => e.nombre}
              getOptionValue={(e) => String(e.id)}
              onChange={(e: GeneralOption[]) => setTagGeneral(e)}
              styles={{
                container: (base) => ({
                  ...base,
                  width: '100%',
                }),
              }}
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              <h4>Asignar temas al artículo</h4>
            </Field.Label>
            <Select
              isMulti
              value={temaGeneral}
              onChange={(e: GeneralOption[]) => setTemaGeneral(e)}
              options={forms_data.temas}
              getOptionLabel={(e) => e.nombre}
              getOptionValue={(e) => String(e.id)}
              styles={{
                container: (base) => ({
                  ...base,
                  width: '100%',
                  marginBottom: '1rem',
                }),
              }}
            />
          </Field.Root>
        </VStack>
      </form>

      <ButtonControls
        form={'article-form'}
        reject={{ text: 'Eliminar', event: deleteArticleCategorizaion }}
      /> */}
    </div>
  );
}

export default GeneralForm;
