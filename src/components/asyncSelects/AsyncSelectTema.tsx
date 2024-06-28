import { useEffect, useRef, useState } from 'react';
import { getTemaCategorization } from '../../utils/asyncFunc';

import AsyncSelect from 'react-select/async';

interface TagOption {
  id: number;
  nombre: string;
}

interface AsyncSelectTemaProps {
  projectId: number;
  sendResponse: (
    response: TagOption | TagOption[] | null,
    input: string
  ) => void;
  isMulti?: boolean;
  defaultValue?: { nombre: string; id: number }[];
  placeholder?: string;
  name?: string;
  maxHeight?: number;
  clear?: React.SetStateAction<boolean>;
}

const AsyncSelectTema: React.FC<AsyncSelectTemaProps> = ({
  projectId,
  sendResponse,
  isMulti = false,
  placeholder = 'Buscar',
  name = 'objetivo',
  maxHeight = 150,
  clear,
}) => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [inputAutorValue, setInputAutorValue] = useState('');
  const [autorOptions, setAutorOptions] = useState<TagOption[]>([]);

  const searchTimeoutRef = useRef<number | null>(null);

  async function loadOptions(query: string): Promise<TagOption[]> {
    try {
      if (query.length < 2) {
        throw new Error('Para buscar, por favor ingrese 2 o más caracteres');
      }
      return new Promise((resolve, reject) => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = window.setTimeout(async () => {
          try {
            const response = await getTemaCategorization(query, projectId);

            if (Array.isArray(response.temas)) {
              resolve(response.temas);
            } else {
              resolve([]);
            }
          } catch (error) {
            reject(error);
          }
        }, 500);
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function clearInput() {
    setInputAutorValue('');
    setAutorOptions([]);
    setForceUpdate(!forceUpdate);
  }

  useEffect(() => {
    if (clear) {
      clearInput();
    }
  }, [clear]);

  useEffect(() => {
    sendResponse(autorOptions, inputAutorValue);
  }, [autorOptions, sendResponse, inputAutorValue]);

  return (
    <AsyncSelect
      isMulti={isMulti}
      noOptionsMessage={() => 'Sin resultados'}
      className="mb-3"
      cacheOptions
      key={`objective-${forceUpdate ? 'refresh' : 'normal'}`}
      name={name}
      getOptionLabel={(e: TagOption) => e.nombre}
      getOptionValue={(e: TagOption) => e.id.toString()}
      loadOptions={loadOptions}
      onInputChange={(value) => setInputAutorValue(value)}
      onChange={(value) =>
        setAutorOptions(Array.isArray(value) ? value : [value])
      }
      placeholder={placeholder}
      menuPortalTarget={document.body}
      maxMenuHeight={maxHeight}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (base) => ({
          ...base,
        }),
        menu: (base) => ({
          ...base,
          position: 'absolute',
          zIndex: 100,
        }),
      }}
    />
  );
};

export default AsyncSelectTema;
