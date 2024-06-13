import { useEffect, useRef, useState } from 'react';
import { getTagCategorization } from '../../utils/asyncFunc';

import AsyncSelect from 'react-select/async';

interface AsyncSelectProps {
  request: {
    url: string;
    func: (url: string, method: string, body: any) => [];
    method: string;
    body: any;
  };
  config: {
    isMulti: boolean;
    name: string;
    placeholder: string;
    maxHeight: number;
  };
  returnResponse: (autorOptions) => void;
}

function SelectAsync({ request, config, returnResponse }: AsyncSelectProps) {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [inputAutorValue, setInputAutorValue] = useState('');
  const [autorOptions, setAutorOptions] = useState(null);

  const searchTimeoutRef = useRef<number>(null);

  async function searchUser(query: string) {
    try {
      if (query.length < 2) {
        throw new Error('Para busca por favor ingrese 2 o más caracteres');
      }
      return new Promise((resolve, reject) => {
        searchTimeoutRef.current && clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(async () => {
          try {
            const response = await request.func(
              request.url,
              request.method,
              request.body
            );

            resolve(response);
          } catch (error) {
            reject(error);
          }
        }, 500);
      });
    } catch (error) {
      console.error(error.message ? error.message : error);
      return [];
    }
  }

  // function clearInput() {
  //   setInputAutorValue('');
  //   setAutorOptions(null);
  //   setForceUpdate(!forceUpdate);
  // }

  // useEffect(() => {
  //   clearInput();
  //   return () => {};
  // }, [clear]);

  useEffect(() => {
    returnResponse(autorOptions);
    return () => {};
  }, [autorOptions]);

  return (
    <>
      <AsyncSelect
        isMulti={isMulti}
        noOptionsMessage={() => 'Sin resultados'}
        className="mb-3"
        cacheOptions
        key={`objetive-${forceUpdate ? 'refresh' : 'normal'}`}
        name={config.name}
        getOptionLabel={(e) => e.nombre}
        getOptionValue={(e) => e.id}
        loadOptions={searchUser}
        onInputChange={(value) => setInputAutorValue(value)}
        onChange={(value) => setAutorOptions(value)}
        isClearable={false}
        placeholder={config.placeholder}
        menuPortalTarget={document.body}
        maxMenuHeight={config.maxHeight}
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
    </>
  );
}

export default SelectAsync;
