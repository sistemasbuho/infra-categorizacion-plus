import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { article, GeneralOption } from '../../../interfaces/generals';
import { useArticleContext } from '../../../context/ArticleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { putArticle } from '../../../utils/asyncFunc';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import ButtonControls from '../../controls/ButtonControls';
import styles from '../../../assets/css/components/modals/modals.module.css';
import Select from 'react-select';
import toast from 'react-hot-toast';
import { Button, Heading, Text } from '@chakra-ui/react';

interface Props {
  article: article;
  setShow: Dispatch<SetStateAction<boolean>>;
}

function ConfirmDeleteArticle({ setShow }: Props): React.ReactElement {
  const [justificacion, setJustificacion] = useState(null);
  const { article, setArticle } = useArticleContext().articleState;

  const OptionsFromInactive: GeneralOption[] = [
    {
      id: 1,
      nombre: 'Incompleto',
    },
    {
      id: 2,
      nombre: 'Sin transcripción',
    },
    {
      id: 3,
      nombre: 'Sin mención',
    },
    {
      id: 4,
      nombre: 'Irrelevante (matriz)',
    },
    {
      id: 5,
      nombre: 'Repetida',
    },

    {
      id: 6,
      nombre: 'Ubicación',
    },
    {
      id: 7,
      nombre: 'Otro',
    },
  ];

  const OptionsFromActive: GeneralOption[] = [
    {
      id: 1,
      nombre: ' Artículo borrado accidentalmente',
    },
    {
      id: 2,
      nombre: 'Mención mal escrita, pero igual se debe categorizar',
    },
    {
      id: 3,
      nombre: 'Transcripción de audio incompleto, pero se escucha la mención.',
    },
    {
      id: 4,
      nombre: 'Otro',
    },
  ];

  const estado = article?.articulo.state ? 'False' : 'True';

  async function disableArticle() {
    const update = {
      estado,
      justificacion,
    };

    await putArticle(article?.articulo.id, update).then(() => {
      const state = update.estado === 'True' ? true : false;
      setArticle((prev) => {
        return {
          ...prev,
          articulo: { ...prev.articulo, state },
        };
      });

      toast.success(
        estado !== 'True' ? 'El artículo se activó' : 'El artículo se desactivó'
      );

      closeModal();
    });
  }

  function closeModal() {
    setShow(false);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal_cont}>
        <div className={styles.header}>
          <Heading mb={4}>Cambiar estado</Heading>

          <Button onClick={closeModal}>
            <FontAwesomeIcon icon={faClose} />
          </Button>
        </div>

        <div className={styles.body}>
          <Text>
            Esto cambiara de estado el artículo:{' '}
            <strong>{article.articulo.titulo}</strong>
          </Text>

          <Text my={4}>
            Seleccioné el motivo por el cual desea cambiar el estado del
            artículo:
          </Text>

          <form
            id="disable_article"
            onSubmit={(e: FormEvent) => {
              e.stopPropagation();
              e.preventDefault();
              disableArticle();
            }}
          >
            <Select
              options={
                article.articulo.state ? OptionsFromActive : OptionsFromInactive
              }
              getOptionLabel={(e) => e.nombre}
              getOptionValue={(e) => String(e.id)}
              onChange={(e) => setJustificacion(e.nombre)}
            />
          </form>
          <br />

          <ButtonControls
            form="disable_article"
            reject={{ event: closeModal }}
            accept={{ disabled: justificacion === null }}
          />
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteArticle;
