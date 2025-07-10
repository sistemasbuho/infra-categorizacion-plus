import { useEffect, useRef, useState } from 'react';
import { getTipoPublicacionCategorization } from '../../utils/asyncFunc';

import AsyncSelect from 'react-select/async';

interface TipoOption {
  id: number;
  nombre: string;
}

interface AsyncSelectTipoProps {
  sendResponse: (
    response: TipoOption | TipoOption[] | null,
    input: string
  ) => void;
  isMulti?: boolean;
  placeholder?: string;
  name?: string;
  maxHeight?: number;
  clear?: React.SetStateAction<boolean>;
}

const AsyncSelectTipo: React.FC<AsyncSelectTipoProps> = ({
  sendResponse,
  isMulti = false,
  placeholder = 'Buscar',
  name = 'tipo',
  maxHeight = 150,
  clear,
}) => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<TipoOption[]>([]);

  const searchTimeoutRef = useRef<number | null>(null);

  async function loadOptions(query: string): Promise<TipoOption[]> {
    try {
      if (query.length < 1) {
        return [];
      }
      return new Promise((resolve, reject) => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = window.setTimeout(async () => {
          try {
            const response = await getTipoPublicacionCategorization(query);

            if (Array.isArray(response)) {
              resolve(response);
            } else if (
              response &&
              typeof response === 'object' &&
              'tipos' in response
            ) {
              resolve((response as any).tipos);
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
    setInputValue('');
    setSelectedOptions([]);
    setForceUpdate(!forceUpdate);
  }

  useEffect(() => {
    if (clear) {
      clearInput();
    }
  }, [clear]);

  useEffect(() => {
    sendResponse(selectedOptions, inputValue);
  }, [selectedOptions, sendResponse, inputValue]);

  return (
    <AsyncSelect
      isMulti={isMulti}
      noOptionsMessage={() => 'Sin resultados'}
      className="mb-3"
      cacheOptions
      key={`tipo-${forceUpdate ? 'refresh' : 'normal'}`}
      name={name}
      getOptionLabel={(e: TipoOption) => e.nombre}
      getOptionValue={(e: TipoOption) => e.id.toString()}
      loadOptions={loadOptions}
      onInputChange={(value) => setInputValue(value)}
      onChange={(value) =>
        setSelectedOptions(Array.isArray(value) ? value : [value])
      }
      isClearable={false}
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

export default AsyncSelectTipo;
