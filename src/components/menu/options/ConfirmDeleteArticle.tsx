import { article, GeneralOption } from '../../../interfaces/generals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';

import styles from '../../../assets/css/components/modals/modals.module.css';
import Select from 'react-select';
import ButtonControls from '../../controls/ButtonControls';

interface Props {
  article: article;
  setShow: Dispatch<SetStateAction<boolean>>;
}

function ConfirmDeleteArticle({ article, setShow }: Props): React.ReactElement {
  console.log(article.titulo);

  const OptionsFromDelete: GeneralOption[] = [
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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal_cont}>
        <div className={styles.header}>
          <h2>Cambiar estado</h2>

          <button onClick={() => setShow(false)}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        <div className={styles.body}>
          <p>Esto cambiara de estado siguiente artículo:</p>

          <p>
            <strong>{article.titulo}</strong>
          </p>

          <p>
            Seleccioné el motivo por el cual desea cambiar el estado del
            artículo:
          </p>

          <Select
            options={OptionsFromDelete}
            getOptionLabel={(e) => e.nombre}
            getOptionValue={(e) => String(e.id)}
          />

          <br />

          <ButtonControls form="header-form" />
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteArticle;
