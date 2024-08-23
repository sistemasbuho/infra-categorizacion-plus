import { GeneralOption } from '../../../../interfaces/generals';
import {
  postArticleCategorization,
  deleteArticleCategorization,
} from '../../../../utils/asyncFunc';
import { useArticleContext } from '../../../../context/ArticleContext';
import { Form } from 'react-bootstrap';

import Select from 'react-select';
import toast from 'react-hot-toast';
import { useState } from 'react';
import ButtonControls from '../../../controls/ButtonControls';
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
      <Form
        className="mb-3"
        id="article-form"
        onSubmit={sendArticleCategorization}
      >
        <Form.Group className="mb-3">
          <Form.Label>
            <h4>Asignar tags al artículo</h4>
          </Form.Label>
          <Select
            isMulti
            value={tagGeneral}
            options={forms_data.tags}
            getOptionLabel={(e) => e.nombre}
            getOptionValue={(e) => String(e.id)}
            onChange={(e: GeneralOption[]) => setTagGeneral(e)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            <h4>Asignar temas al artículo</h4>
          </Form.Label>
          <Select
            isMulti
            value={temaGeneral}
            onChange={(e: GeneralOption[]) => setTemaGeneral(e)}
            options={forms_data.temas}
            getOptionLabel={(e) => e.nombre}
            getOptionValue={(e) => String(e.id)}
          />
        </Form.Group>
      </Form>

      <ButtonControls
        form={'article-form'}
        reject={{ text: 'Eliminar', event: deleteArticleCategorizaion }}
      />
    </div>
  );
}

export default GeneralForm;
