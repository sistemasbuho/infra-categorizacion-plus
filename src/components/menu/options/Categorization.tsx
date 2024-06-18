import {
  article,
  editCategorization,
  newCategorization,
  Selection,
  Tags,
  Temas,
} from '../../../interfaces/generals';

import {
  postFragment,
  deleteFragment as delFragment,
  postArticleCategorization,
  editFragment,
} from '../../../utils/asyncFunc';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

import AsyncSelectActivoPasivo from '../../asyncSelects/AsyncSelectActivoPasivo';
import styles from '../../../assets/css/components/menu/categorization.module.css';
import Select from 'react-select';

import ButtonControls from '../../controls/ButtonControls';

interface CategorizationProps {
  tags: Tags[];
  temas: Temas[];
  articulo: article;
  fragments: Selection[];
  deleteFragment: (frag: Selection) => void;
}

function Categorization({
  temas,
  tags,
  articulo,
  fragments,
  deleteFragment,
}: CategorizationProps) {
  const [selected, setSelected] = useState(1);

  const [currentFragment, setCurrentFragment] = useState<Selection | null>(
    null
  );
  const [tagOptions, setTagOptions] = useState<Tags[] | null>([]);
  const [temaOption, setTemaOption] = useState<Temas[] | null>([]);
  const [activoOption, setActivoOption] = useState([]);
  const [pasivoOption, setPasivoOption] = useState([]);
  const [tonoOption, setTonoOption] = useState<number>(null);
  const [temaGeneral, setTemaGeneral] = useState<Temas[] | null>([]);
  const [tagGeneral, setTagGeneral] = useState<Tags[] | null>([]);

  const sentimiento = [
    { value: '1', label: 'Positvo' },
    { value: '2', label: 'Neutral' },
    { value: '3', label: 'Negativo' },
  ];

  async function postCurrentFragment() {
    const update: newCategorization = {
      article_fragment: currentFragment.text,
      start_index: currentFragment.startIndex,
      end_index: currentFragment.startIndex + currentFragment.length,
      articulo: articulo.id,
      tag: tagOptions.map((item) => item.id),
      tema: temaOption.map((item) => item.id),
      tono: Number(tonoOption),
      activo: activoOption.map((item) => item.id),
      pasivo: pasivoOption.map((item) => item.id),
    };

    return await postFragment(articulo.id, update);
  }

  async function editCurrentFragment() {
    const update: editCategorization = {
      tono: Number(tonoOption),
      tema: temaOption.map((item) => item.id),
      tag: tagOptions.map((item) => item.id),
      activo: activoOption.map((item) => item.id),
      pasivo: pasivoOption.map((item) => item.id),
    };

    return await editFragment(articulo.id, currentFragment.id, update);
  }

  function sendCategorization(e: React.FormEvent<HTMLFormElement>): void {
    e.stopPropagation();
    e.preventDefault();

    const isSavedFragment = !isNewFragment(currentFragment);
    isSavedFragment ? editCurrentFragment() : postCurrentFragment();
  }

  async function deleteCurrentFragment(frag: Selection) {
    deleteFragment(frag);

    if (!frag.selectionId) {
      return await delFragment(articulo.id, frag.id);
    }

    setCurrentFragment((prev) => {
      if (prev?.id === frag?.id || prev?.selectionId === frag?.selectionId) {
        return null;
      }
      return prev;
    });
  }

  async function sendArticleCategorization(e: React.FormEvent) {
    e.preventDefault();
    const update = {
      tema: temaGeneral.map((item) => item.id),
      tag: tagGeneral.map((item) => item.id),
    };

    const response = await postArticleCategorization(articulo.id, update);
    console.log(response);
  }

  function getAsyncActivo(data) {
    setActivoOption(data);
  }

  function getAsyncPasivo(data) {
    setPasivoOption(data);
  }

  function isNewFragment(frag: Selection) {
    return frag?.selectionId ? true : false;
  }

  return (
    <>
      <div>
        <h2>CATEGORIZACIÓN</h2>
      </div>

      <div className={`${styles.body} p-0`}>
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
        <div className={`${styles.section_body} p-0`}>
          {selected === 1 && (
            <>
              <div className={styles.fragments_cont}>
                <div>
                  <h4>Fragmentos</h4>

                  <div className={styles.list}>
                    {fragments.length > 0 ? (
                      fragments.map((frag, i) => (
                        <div
                          className={`${styles.fragment} ${
                            !frag?.selectionId && styles.fragment_saved
                          }  ${
                            currentFragment?.id === frag?.id &&
                            styles.fragment_selected
                          }`}
                          key={i}
                          onClick={() => setCurrentFragment(frag)}
                        >
                          <p>{frag.text}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCurrentFragment(frag);
                            }}
                          >
                            <FontAwesomeIcon icon={faClose} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-center m-0">Aún no hay fragmentos</p>
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
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <h4>Tema</h4>
                      </Form.Label>
                      <Select
                        isMulti
                        options={temas.map((item) => ({
                          label: item.nombre,
                          value: item.id,
                        }))}
                        onChange={(e) =>
                          setTemaOption(
                            e.map((item) => ({
                              id: item.value,
                              nombre: item.label,
                            }))
                          )
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <h4>Tag</h4>
                      </Form.Label>
                      <Select
                        isMulti
                        options={tags.map((item) => ({
                          label: item.nombre,
                          value: item.id,
                        }))}
                        onChange={(e) =>
                          setTagOptions(
                            e.map((item) => ({
                              id: item.value,
                              nombre: item.label,
                            }))
                          )
                        }
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        <h4>Activo</h4>
                      </Form.Label>
                      <AsyncSelectActivoPasivo
                        isMulti
                        sendResponse={getAsyncActivo}
                      />{' '}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="pasivo">
                        <h4>Pasivo</h4>
                      </Form.Label>
                      <AsyncSelectActivoPasivo
                        isMulti
                        sendResponse={getAsyncPasivo}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label htmlFor="pasivo">
                        <h4>Sentimiento</h4>
                      </Form.Label>
                      <Select
                        options={sentimiento}
                        placeholder={'Buscar'}
                        onChange={(e) => setTonoOption(Number(e.value))}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>
              <ButtonControls
                form="categorization-form"
                accept={{ disabled: !currentFragment }}
                reject={{ disabled: !currentFragment }}
              />
            </>
          )}

          {selected === 2 && (
            <>
              <Form id="article-form" onSubmit={sendArticleCategorization}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <h4>Asignar tags al artículo</h4>
                  </Form.Label>
                  <Select
                    isMulti
                    options={temas.map((item) => ({
                      label: item.nombre,
                      value: item.id,
                    }))}
                    onChange={(e) =>
                      setTagGeneral(
                        e.map((item) => ({
                          id: item.value,
                          nombre: item.label,
                        }))
                      )
                    }
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>
                    <h4>Asignar temas al artículo</h4>
                  </Form.Label>
                  <Select
                    isMulti
                    options={temas.map((item) => ({
                      label: item.nombre,
                      value: item.id,
                    }))}
                    onChange={(e) =>
                      setTemaGeneral(
                        e.map((item) => ({
                          id: item.value,
                          nombre: item.label,
                        }))
                      )
                    }
                  />{' '}
                </Form.Group>
              </Form>

              <ButtonControls form={'article-form'} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Categorization;
