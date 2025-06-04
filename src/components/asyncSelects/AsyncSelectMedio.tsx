import { useEffect, useRef, useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { searchMedio } from '../../utils/asyncFunc';
import { Medios } from '../../interfaces/generals';

interface TagOption {
  id: number;
  nombre: string;
  ubicacion_nombre?: string | null;
  isNew?: boolean;
}

interface AsyncSelectMedioProps {
  sendResponse: (response: Medios[]) => void;
  isMulti?: boolean;
  placeholder?: string;
  name?: string;
  maxHeight?: number;
  clear?: React.SetStateAction<boolean>;
  value: Medios[];
}

const AsyncSelectMedio: React.FC<AsyncSelectMedioProps> = ({
  sendResponse,
  isMulti = false,
  placeholder = 'Buscar',
  name = 'objetivo',
  maxHeight = 150,
  value,
}) => {
  const [forceUpdate] = useState(false);
  // const [inputAutorValue, setInputAutorValue] = useState('');
  const [autorOptions, setAutorOptions] = useState<Medios[]>(value);

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
            const response = await searchMedio(query);

            if (response && response.Medio_general) {
              resolve(response.Medio_general);
            } else {
              resolve([]);
            }
          } catch (error) {
            reject(error);
          }
        }, 500);
      });

      return await res;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const sendResponseCallback = useCallback(() => {
    sendResponse(autorOptions);
  }, [autorOptions, sendResponse]);

  useEffect(() => {
    sendResponseCallback();
  }, [autorOptions, sendResponseCallback]);

  return (
    <AsyncSelect
      isMulti={isMulti}
      noOptionsMessage={() => 'No se encontraron resultados'}
      className="mb-3"
      cacheOptions
      value={autorOptions}
      key={`objective-${forceUpdate ? 'refresh' : 'normal'}`}
      name={name}
      getOptionLabel={(e: TagOption) => `${e.nombre} | ${e.ubicacion_nombre}`}
      getOptionValue={(e) => e.id.toString()}
      loadOptions={loadOptions}
      // onInputChange={(value) => setInputAutorValue(value)}
      onChange={(value) =>
        setAutorOptions(Array.isArray(value) ? value : [value])
      }
      isClearable={false}
      placeholder={placeholder}
      menuPortalTarget={document.body}
      maxMenuHeight={maxHeight}
      styles={{
        container: (base) => ({
          ...base,
          width: '100%',
        }),
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

export default AsyncSelectMedio;
