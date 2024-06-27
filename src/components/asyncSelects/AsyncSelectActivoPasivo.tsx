import { useEffect, useRef, useState } from 'react';
import { getActivoPasivoCategorization } from '../../utils/asyncFunc';

import AsyncSelect from 'react-select/async';
import { GeneralOption } from '../../interfaces/generals';

interface TagOption {
  id: number;
  nombre: string;
  ubicacion_nombre?: string | null;
  isNew?: boolean;
}

interface AsyncSelectActivoPasivoProps {
  sendResponse: (
    response: TagOption | TagOption[] | null,
    input: string
  ) => void;
  isMulti?: boolean;
  placeholder?: string;
  name?: string;
  maxHeight?: number;
  clear?: React.SetStateAction<boolean>;
  value?: GeneralOption[];
}

const AsyncSelectActivoPasivo: React.FC<AsyncSelectActivoPasivoProps> = ({
  sendResponse,
  isMulti = false,
  placeholder = 'Buscar',
  name = 'objetivo',
  maxHeight = 150,
  clear,
  value,
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

      const res = new Promise<TagOption[]>((resolve, reject) => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = window.setTimeout(async () => {
          try {
            const response = await getActivoPasivoCategorization(query);

            if (response && response.Actor) {
              resolve(response.Actor);
            } else {
              resolve([]);
            }
          } catch (error) {
            reject(error);
          }
        }, 500);
      });

      const result = await res;

      if (result.length > 0) {
        return result;
      } else {
        return [
          {
            id: Date.now(),
            nombre: query,
            isNew: true,
          },
        ];
      }
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
    clearInput();
  }, [clear]);

  useEffect(() => {
    sendResponse(autorOptions, inputAutorValue);
  }, [autorOptions, sendResponse, inputAutorValue]);

  return (
    <AsyncSelect
      isMulti={isMulti}
      value={value}
      noOptionsMessage={() => 'Sin resultados'}
      className="mb-3"
      cacheOptions
      key={`objective-${forceUpdate ? 'refresh' : 'normal'}`}
      name={name}
      getOptionLabel={(e: TagOption) => {
        if (e.isNew) {
          return `${e.nombre} ( Nuevo )`;
        } else if (e.ubicacion_nombre) {
          return `${e.nombre} | ${e.ubicacion_nombre}`;
        }
        return e.nombre;
      }}
      getOptionValue={(e) => e.id.toString()}
      loadOptions={loadOptions}
      onInputChange={(value) => setInputAutorValue(value)}
      onChange={(value) =>
        setAutorOptions(Array.isArray(value) ? value : [value])
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

export default AsyncSelectActivoPasivo;
