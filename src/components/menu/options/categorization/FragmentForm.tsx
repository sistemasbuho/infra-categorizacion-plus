import {
  Categorization as FragmentCategorization,
  editCategorization,
  Selection,
  GeneralOption,
} from '../../../../interfaces/generals';
import {
  postFragment,
  deleteFragment as delFragment,
  editFragment,
} from '../../../../utils/asyncFunc';
import { useArticleContext } from '../../../../context/ArticleContext';
import { useFragmentContext } from '../../../../context/FragmentsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-bootstrap';

import AsyncSelectActivoPasivo from '../../../asyncSelects/AsyncSelectActivoPasivo';
import ButtonControls from '../../../controls/ButtonControls';
import styles from '../../../../assets/css/components/menu/categorization.module.css';
import Select from 'react-select';
import toast from 'react-hot-toast';
function FragmentForm() {
  // Context
  const { temas, tags } = useArticleContext().articleState.article.forms_data;
  const { articulo } = useArticleContext().articleState.article;
  const { current, methods, allFrags } = useFragmentContext();
  const { currentFragment, setCurrentFragment } = current;
  const { allFragments } = allFrags;

  const { delete: deleteFragment, save: saveFragment } = methods;

  const [isValidTema, setIsValidTema] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  const sentimiento: GeneralOption[] = [
    { id: 1, nombre: 'Positvo' },
    { id: 2, nombre: 'Neutral' },
    { id: 3, nombre: 'Negativo' },
  ];

  //fragments
  const [tagOptions, setTagOptions] = useState<GeneralOption[] | null>();
  const [temaOption, setTemaOption] = useState<GeneralOption[] | null>(null);
  const [activoOption, setActivoOption] = useState([]);
  const [pasivoOption, setPasivoOption] = useState([]);
  const [tonoOption, setTonoOption] = useState<GeneralOption | null>(null);

  async function postCurrentFragment() {
    const update: FragmentCategorization = {
      articulo: articulo.id,
      article_fragment: currentFragment.article_fragment,
      start_index: currentFragment.start_index,
      end_index:
        currentFragment.start_index + currentFragment.article_fragment.length,
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
      tono: Number(tonoOption?.id),
    };

    return await postFragment(articulo.id, update)
      .then((res) => {
        const { fragmento } = res;
        const formatedFragment: Selection = fragmento;
        saveFragment(formatedFragment);
        setCurrentFragment(null);

        toast.success('Fragmento categorizado');
      })
      .catch((err) => {
        console.error(err);

        toast.error('Ha ocurrido un error');
      });
  }

  async function editCurrentFragment() {
    const update: editCategorization = {
      tono: tonoOption?.id,
      tema: temaOption.map((item) => item.id),
      tag: tagOptions.map((item) => item.id),
      activo: activoOption.map((item) => item.id),
      pasivo: pasivoOption.map((item) => item.id),
    };

    return await editFragment(articulo.id, currentFragment.id, update)
      .then(() => {
        toast.success('Fragmento editado');
      })
      .catch((err) => {
        console.error(err);

        toast.error('Ha ocurrido un error');
      });
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
    setTagOptions(currentFragment?.tag);
    setTemaOption(currentFragment?.tema);
    setPasivoOption(currentFragment?.pasivo);
    setActivoOption(currentFragment?.activo);
    setTonoOption(
      sentimiento.find((sent) => sent?.id === currentFragment?.tono) ||
        sentimiento[1]
    );

    return () => {};
  }, [currentFragment]);

  useEffect(() => {
    if (temaOption === null || temaOption?.length <= 0) {
      return setIsValidTema(false);
    }
    return setIsValidTema(true);
  }, [temaOption]);

  return (
    <div>
      <div className={styles.fragments_cont}>
        <div>
          <h4>Fragmentos</h4>
          <div className={styles.list}>
            {allFragments.length > 0 ? (
              allFragments
                .sort((a, b) => a.id - b.id)
                .map((frag, i) => {
                  return (
                    <a
                      href={`#${frag.start_index}_${frag.article_fragment.length}`}
                      key={i}
                    >
                      <div
                        className={`
                  ${styles.fragment}
                  ${!frag?.selectionId && frag?.id && styles.fragment_saved} 
                  ${
                    currentFragment?.id === frag?.id && styles.fragment_selected
                  }`}
                        onClick={() => setCurrentFragment(frag)}
                      >
                        <p>{frag.article_fragment}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCurrentFragment(frag);
                          }}
                        >
                          <FontAwesomeIcon icon={faClose} />
                        </button>
                      </div>
                    </a>
                  );
                })
            ) : (
              <p className="text-center m-0 py-2">Aún no hay fragmentos</p>
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
                isDisabled={!currentFragment}
                isMulti
                isClearable={false}
                options={temas}
                getOptionLabel={(e) => e.nombre}
                getOptionValue={(e) => String(e.id)}
                value={temaOption}
                onChange={(e: GeneralOption[]) => setTemaOption(e)}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: isValidTema ? 'hsl( 0, 0%, 80%)' : 'red',
                  }),
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <h4>Tag</h4>
              </Form.Label>

              <Select
                isDisabled={!currentFragment}
                isMulti
                isClearable={false}
                getOptionLabel={(e) => e.nombre}
                getOptionValue={(e) => String(e.id)}
                options={tags}
                value={tagOptions}
                onChange={(e: GeneralOption[]) => setTagOptions(e)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <h4>Activo</h4>
              </Form.Label>
              <AsyncSelectActivoPasivo
                isDisabled={!currentFragment}
                isMulti
                sendResponse={getAsyncActivo}
                clear={forceUpdate}
                value={currentFragment?.activo}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="pasivo">
                <h4>Pasivo</h4>
              </Form.Label>
              <AsyncSelectActivoPasivo
                isDisabled={!currentFragment}
                isMulti
                sendResponse={getAsyncPasivo}
                clear={forceUpdate}
                value={currentFragment?.pasivo}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="pasivo">
                <h4>Tonalidad</h4>
              </Form.Label>
              <Select
                isDisabled={!currentFragment}
                options={sentimiento}
                placeholder={'Buscar'}
                onChange={(e) => setTonoOption(e)}
                getOptionLabel={(e) => e.nombre}
                getOptionValue={(e) => String(e.id)}
                value={tonoOption}
              />
            </Form.Group>
          </Form>
        </div>
      </div>

      <p className="text-center mb-0 pb-3">
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
    </div>
  );
}

export default FragmentForm;
