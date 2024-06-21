import {
  article,
  ArticleCategorization,
  Categorization as FragmentCategorization,
  editCategorization,
  Selection,
  Tags,
  Temas,
  GeneralOption,
  SelectOption,
} from '../../../interfaces/generals';
import {
  postFragment,
  deleteFragment as delFragment,
  postArticleCategorization,
  deleteArticleCategorization as delArticleCategorization,
  editFragment,
} from '../../../utils/asyncFunc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

import AsyncSelectActivoPasivo from '../../asyncSelects/AsyncSelectActivoPasivo';
import ButtonControls from '../../controls/ButtonControls';
import styles from '../../../assets/css/components/menu/categorization.module.css';
import Select from 'react-select';

interface CategorizationProps {
  ArticleCategorization: ArticleCategorization;
  tags: Tags[];
  temas: Temas[];
  articulo: article;
  fragments: Selection[];
  deleteFragment: (frag: Selection) => void;

  setSelections: Dispatch<SetStateAction<Selection[]>>;
  setNewSelections: Dispatch<SetStateAction<Selection[]>>;
}

function Categorization({
  ArticleCategorization,
  temas,
  tags,
  articulo,
  fragments,
  deleteFragment,
  setSelections,
  setNewSelections,
}: CategorizationProps) {
  const [selected, setSelected] = useState(1);

  const [currentFragment, setCurrentFragment] = useState<Selection | null>(
    null
  );

  const [isValidTema, setIsValidTema] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const [tagOptions, setTagOptions] = useState<Tags[] | null>();
  const [temaOption, setTemaOption] = useState<Temas[] | null>(null);
  const [activoOption, setActivoOption] = useState([]);
  const [pasivoOption, setPasivoOption] = useState([]);
  const [tonoOption, setTonoOption] = useState<GeneralOption | null>(null);
  const [temaGeneral, setTemaGeneral] = useState<Temas[] | null>(
    ArticleCategorization.temas
  );
  const [tagGeneral, setTagGeneral] = useState<Tags[] | null>(
    ArticleCategorization.tags
  );
  const sentimiento: SelectOption[] = [
    { value: 1, label: 'Positvo' },
    { value: 2, label: 'Neutral' },
    { value: 3, label: 'Negativo' },
  ];

  // Articulo
  async function sendArticleCategorization(e: React.FormEvent) {
    e.preventDefault();
    const update = {
      tema: temaGeneral.map((item) => item.id),
      tag: tagGeneral.map((item) => item.id),
    };

    await postArticleCategorization(articulo.id, update);
  }

  async function deleteArticleCategorizaion() {
    setTagGeneral([]);
    setTemaGeneral([]);
    await delArticleCategorization(articulo.id);
  }

  // Fragmento
  async function postCurrentFragment() {
    const update: FragmentCategorization = {
      articulo: articulo.id,
      article_fragment: currentFragment.text,
      start_index: currentFragment.startIndex,
      end_index: currentFragment.startIndex + currentFragment.text.length,
      tag: tagOptions.map((item) => item.id),
      tema: temaOption.map((item) => item.id),
      activo: activoOption.map((item) => {
        if (item.isNew) {
          return item.nombre;
        }
        return item.id;
      }),
      pasivo: pasivoOption.map((item) => {
        if (item.isNew) {
          return item.nombre;
        }
        return item.id;
      }),
      tono: Number(tonoOption.id),
    };

    return await postFragment(articulo.id, update).then((res) => {
      const { fragmento } = res;
      const fragmentSaved: Selection = {
        ...fragmento,
        id: fragmento.id,
        text: fragmento.article_fragment,
        length: fragmento.article_fragment.length,
        startIndex: Number(fragmento.start_index),
      };

      delete fragmentSaved.selectionId;
      setSelections((prev) => [...prev, fragmentSaved]);
      setNewSelections((prev) =>
        prev.filter(
          (sel) =>
            sel?.id !== fragmentSaved?.id ||
            sel?.selectionId !== fragmentSaved?.selectionId
        )
      );
    });
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

  function clearForm() {
    setForceUpdate((prev) => !prev);
    setTagOptions([]);
    setTemaOption([]);
    setActivoOption([]);
    setPasivoOption([]);
    setTonoOption(null);
  }

  function sendCategorization(e: React.FormEvent<HTMLFormElement>): void {
    e.stopPropagation();
    e.preventDefault();

    const isSavedFragment = !isNewFragment(currentFragment);
    isSavedFragment ? editCurrentFragment() : postCurrentFragment();
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

  useEffect(() => {
    setTagOptions(currentFragment?.tag_details);
    setTemaOption(currentFragment?.tema_details);
    setPasivoOption(currentFragment?.pasivo_details);
    setActivoOption(currentFragment?.activo_details);

    return () => {};
  }, [currentFragment]);

  useEffect(() => {
    if (temaOption === null || temaOption?.length <= 0) {
      return setIsValidTema(false);
    }
    return setIsValidTema(true);
  }, [temaOption]);

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
                          className={`
                            ${styles.fragment}
                            ${!frag?.selectionId && styles.fragment_saved} 
                            ${
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
                        value={temaOption?.map((item) => ({
                          label: item?.nombre,
                          value: item?.id,
                        }))}
                        onChange={(e) =>
                          setTemaOption(
                            e.map((item) => ({
                              id: item.value,
                              nombre: item.label,
                            }))
                          )
                        }
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: isValidTema
                              ? 'hsl( 0, 0%, 80%)'
                              : 'red',
                          }),
                        }}
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
                        value={tagOptions?.map((item) => ({
                          label: item?.nombre,
                          value: item?.id,
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
                        clear={forceUpdate}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="pasivo">
                        <h4>Pasivo</h4>
                      </Form.Label>
                      <AsyncSelectActivoPasivo
                        isMulti
                        sendResponse={getAsyncPasivo}
                        clear={forceUpdate}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label htmlFor="pasivo">
                        <h4>Sentimiento</h4>
                      </Form.Label>
                      <Select
                        options={sentimiento.map((item) => ({
                          label: item.label,
                          value: item.value,
                        }))}
                        placeholder={'Buscar'}
                        onChange={(e) =>
                          setTonoOption({
                            id: Number(e.value),
                            nombre: e.label,
                          })
                        }
                        value={{
                          label: tonoOption?.nombre,
                          value: tonoOption?.id,
                        }}
                      />
                    </Form.Group>
                  </Form>
                </div>
              </div>

              <p className="text-center mb-0">
                {!currentFragment
                  ? 'Por favor seleccione un fragmento'
                  : !isValidTema
                  ? 'Por favor seleccione un tema'
                  : null}
              </p>

              <ButtonControls
                form="categorization-form"
                accept={{ disabled: !currentFragment || !isValidTema }}
                reject={{ disabled: !currentFragment, event: clearForm }}
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
                    value={tagGeneral?.map((item) => ({
                      label: item.nombre,
                      value: item.id,
                    }))}
                    options={tags.map((item) => ({
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
                    defaultValue={ArticleCategorization.tags?.map((e) => ({
                      label: e.nombre,
                      value: e.id,
                    }))}
                  />{' '}
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
                    value={temaGeneral?.map((item) => ({
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
                    defaultValue={ArticleCategorization.temas?.map((e) => ({
                      label: e.nombre,
                      value: e.id,
                    }))}
                  />
                </Form.Group>
              </Form>

              <ButtonControls
                form={'article-form'}
                reject={{ text: 'Eliminar', event: deleteArticleCategorizaion }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Categorization;
