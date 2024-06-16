import { article, NewSelection, Selection } from '../../../interfaces/generals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

import AsyncSelectActivoPasivo from '../../asyncSelects/AsyncSelectActivoPasivo';
import AsyncSelectTema from '../../asyncSelects/AsyncSelectTema';
import AsyncSelectTag from '../../asyncSelects/AsyncSelectTag';
import optionStyles from '../../../assets/css/components/menu/options.module.css';
import styles from '../../../assets/css/components/menu/categorization.module.css';
import Select from 'react-select';

interface CategorizationProps {
  articulo: article;
  fragments: Selection[];
  deleteFragment: (frag: Selection | NewSelection) => void;
}

function Categorization({
  articulo,
  fragments,
  deleteFragment,
}: CategorizationProps) {
  const [selected, setSelected] = useState(1);

  const [currentFragment, setCurrentFragment] = useState<
    Selection | NewSelection | null
  >(null);

  const [tagOptions, setTagOptions] = useState({});
  const [temaOption, setTemaOption] = useState({});
  const [activoOption, setActivoOption] = useState({});
  const [pasivoOption, setPasivoOption] = useState({});
  const [tonoOption, setTonoOption] = useState({});

  const sentimiento = [
    { value: '1', label: 'Positvo' },
    { value: '2', label: 'Neutral' },
    { value: '3', label: 'Negativo' },
  ];

  function sendCategorization(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const update = {
      tagOptions,
      temaOption,
      activoOption,
      pasivoOption,
      tonoOption,
    };

    console.log(update);
  }

  function getAsyncTag(data) {
    setTagOptions(data);
  }

  function getAsyncTema(data) {
    setTemaOption(data);
  }

  function getAsyncActivo(data) {
    setActivoOption(data);
  }

  function getAsyncPasivo(data) {
    setPasivoOption(data);
  }

  function isNewSelection(
    selection: Selection | NewSelection
  ): selection is NewSelection {
    return (selection as NewSelection).selectionId !== undefined;
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
                  {fragments.length > 0 ? (
                    fragments.map((frag, i) => (
                      <div
                        className={`${styles.fragment} ${
                          currentFragment &&
                          ((isNewSelection(currentFragment) &&
                            isNewSelection(frag) &&
                            currentFragment.selectionId === frag.selectionId) ||
                            (!isNewSelection(currentFragment) &&
                              !isNewSelection(frag) &&
                              currentFragment.id === frag.id)) &&
                          styles.fragment_selected
                        }`}
                        key={i}
                        onClick={() => setCurrentFragment(frag)}
                      >
                        <p>{frag.text}</p>
                        <button onClick={() => deleteFragment(frag)}>
                          <FontAwesomeIcon icon={faClose} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="py-2 text">Aún no hay fragmentos</p>
                  )}
                </div>

                <hr />
              </div>
              <div className={styles.form}>
                <Form
                  id="categorization-form"
                  onSubmit={sendCategorization}
                  className="mb-3"
                >
                  <Form.Group>
                    <Form.Label>
                      <h4>Tema</h4>
                    </Form.Label>
                    <AsyncSelectTema
                      projectId={articulo.proyecto}
                      sendResponse={getAsyncTema}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      <h4>Tag</h4>
                    </Form.Label>
                    <AsyncSelectTag
                      projectId={articulo.proyecto}
                      sendResponse={getAsyncTag}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      <h4>Activo</h4>
                    </Form.Label>
                    <AsyncSelectActivoPasivo sendResponse={getAsyncActivo} />{' '}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label htmlFor="pasivo">
                      <h4>Pasivo</h4>
                    </Form.Label>
                    <AsyncSelectActivoPasivo sendResponse={getAsyncPasivo} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label htmlFor="pasivo">
                      <h4>Sentimiento</h4>
                    </Form.Label>
                    <Select
                      options={sentimiento}
                      placeholder={'Buscar'}
                      onChange={(e) => setTonoOption(e.value)}
                    />
                  </Form.Group>
                </Form>

                <div className={optionStyles.controls}>
                  <button className={optionStyles.reject}>Eliminar</button>
                  <button className={optionStyles.accept}>Guardar</button>
                </div>
              </div>
            </div>
          )}

          {selected === 2 && (
            <>
              <Form>
                <Form.Group>
                  <Form.Label>
                    <h4>Asignar tags al artículo</h4>
                  </Form.Label>
                  <Select options={sentimiento} placeholder="Buscar" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    <h4>Asignar temas al artículo</h4>
                  </Form.Label>
                  <Select options={sentimiento} placeholder="Buscar" />
                </Form.Group>
              </Form>

              <div className={optionStyles.controls}>
                <button className={optionStyles.reject}>Eliminar</button>
                <button className={optionStyles.accept}>Guardar</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Categorization;
