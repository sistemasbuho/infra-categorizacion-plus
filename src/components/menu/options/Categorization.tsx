import { useState } from 'react';
import { Selection } from '../../../interfaces/generals';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

import '../../../assets/css/components/menu/options.module.css';
import styles from '../../../assets/css/components/menu/categorization.module.css';
import Select from 'react-select';

interface CategorizationProps {
  fragments: Selection[];
  deleteFragment: (frag: Selection) => void;
}

function Categorization({ fragments, deleteFragment }: CategorizationProps) {
  const [selected, setSelected] = useState(1);

  const [opciones, setOpciones] = useState([
    { value: '1', label: 'Tema 1' },
    { value: '2', label: 'Tema 2' },
    { value: '3', label: 'Tema 3' },
    { value: '4', label: 'Tema 4' },
  ]);

  const sentimiento = [
    { value: '1', label: 'Positvo' },
    { value: '2', label: 'Neutral' },
    { value: '3', label: 'Negativo' },
  ];

  function sendCategorization(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert('hola');
  }

  return (
    <>
      <div>
        <h2>CATEGORIZACIÓN</h2>
      </div>

      <div className={styles.body}>
        <div className={styles.nav}>
          <button
            className={`${selected === 1 && styles.selected}`}
            onClick={() => setSelected(1)}
          >
            Por fragmentos
          </button>
          <button
            className={`${selected === 2 && styles.selected}`}
            onClick={() => setSelected(2)}
          >
            General
          </button>
        </div>

        <div className={styles.section_body}>
          {selected === 1 && (
            <div className={styles.fragments_cont}>
              <div>
                <h4>Fragmentos</h4>

                <div className={styles.list}>
                  {fragments.map((frag: Selection, i) => (
                    <div className={styles.fragment} key={i}>
                      <p>{frag.text}</p>

                      <button onClick={() => deleteFragment(frag)}>
                        <FontAwesomeIcon icon={faClose} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.form}>
                <Form id="categorization-form" onSubmit={sendCategorization}>
                  <Form.Group>
                    <Form.Label>Tema</Form.Label>
                    <Select options={opciones} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Tag</Form.Label>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Activo</Form.Label>
                    <Select options={opciones} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label htmlFor="pasivo">Pasivo</Form.Label>
                    <Select options={opciones} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label htmlFor="pasivo">Sentimiento</Form.Label>
                    <Select options={sentimiento} />
                  </Form.Group>
                </Form>

                <div className={`${styles.modal_control}`}>
                  <button
                    className="btn btn-outline-success"
                    form="categorization-form"
                    type="submit"
                  >
                    Categorizar
                  </button>
                </div>
              </div>
            </div>
          )}

          {selected === 2 && <>hola</>}
        </div>
      </div>
    </>
  );
}

export default Categorization;
