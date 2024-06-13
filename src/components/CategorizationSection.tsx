import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';

import styles from '../assets/css/CategorizationSection.module.css';

type CategorizationSectionProps = {
  show: boolean;
  setShow: (value: boolean) => void;
  selections: Selection[];
  deleteSelection: (id: number) => void;
};

function CategorizationSection({
  show,
  setShow,
  selections,
  deleteSelection,
}: CategorizationSectionProps) {
  const [opciones, setOpciones] = useState([
    { value: '1', label: 'Tema 1' },
    { value: '2', label: 'Tema 2' },
    { value: '3', label: 'Tema 3' },
    { value: '4', label: 'Tema 4' },
  ]);
  const sectionRef = useRef<HTMLElement | null>(null);

  function categorize() {
    setShow(false);
  }

  return (
    <section ref={sectionRef} className={`${styles.cont_section} `}>
      <header>
        <h2>Categorizar</h2>
        <button className={styles.btn_close} onClick={() => setShow(false)}>
          <FontAwesomeIcon icon={faClose} />
        </button>
      </header>

      {/* <main>
        {selections.length > 0 ? (
          <>
            <div className={`${styles.selections}`}>
              {selections.map((sel, index) => (
                <div key={index} className={`${styles.ticket}`}>
                  <p>{sel.text}</p>
                  <button onClick={() => deleteSelection(sel.selectionId)}>
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>
              ))}
            </div>
            <div className={`${styles.cont_form_categorization}`}>
              <Form>
                <Form.Group>
                  <Form.Label>Tema</Form.Label>
                  <Select options={opciones} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Tag</Form.Label>
                  <Select options={opciones} />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Activo</Form.Label>
                  <Select options={opciones} />
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="pasivo">Pasivo</Form.Label>
                  <Select options={opciones} />
                </Form.Group>

                <div className={`${styles.modal_control}`}>
                  <button
                    className="btn btn-outline-success"
                    onClick={categorize}
                  >
                    Categorizar
                  </button>
                </div>
              </Form>
            </div>
          </>
        ) : (
          <div>
            <div className="text-center mt-5">
              <p>
                <i>No hay selecciones</i>
              </p>
            </div>
          </div>
        )}
      </main> */}
    </section>
  );
}

export default CategorizationSection;
