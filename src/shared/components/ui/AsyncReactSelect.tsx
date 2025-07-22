import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useTheme } from '../../context/ThemeContext';

interface AsyncReactSelectProps {
  placeholder?: string;
  value?: any;
  onChange: (value: any) => void;
  searchFunction: (searchTerm: string) => Promise<any[]>;
  optionLabelKey?: string;
  optionValueKey?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  isClearable?: boolean;
  noOptionsMessage?: string;
  menuPortalTarget?: boolean;
}

export const AsyncReactSelect = ({
  placeholder = 'Seleccionar...',
  value,
  onChange,
  searchFunction,
  optionLabelKey = 'nombre',
  optionValueKey = 'id',
  label,
  disabled = false,
  className = '',
  isClearable = true,
  noOptionsMessage = 'No se encontraron resultados',
  menuPortalTarget = false,
}: AsyncReactSelectProps) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = async (inputValue: string) => {
    if (!inputValue.trim()) {
      return [];
    }

    setIsLoading(true);
    try {
      const results = await searchFunction(inputValue);
      return results.map((item: any) => ({
        value: item[optionValueKey],
        label: item[optionLabelKey],
        ...item,
      }));
    } catch (error) {
      console.error('Error en búsqueda:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (selectedOption: any) => {
    onChange(selectedOption || null);
  };

  const getSelectValue = () => {
    if (!value) return null;

    if (typeof value === 'object' && value[optionLabelKey]) {
      return {
        value: value[optionValueKey] || value.id || value.uuid,
        label: value[optionLabelKey],
        ...value,
      };
    }

    return null;
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
      borderColor: state.isFocused
        ? theme === 'dark'
          ? '#60a5fa'
          : '#3b82f6'
        : theme === 'dark'
        ? '#4b5563'
        : '#d1d5db',
      color: theme === 'dark' ? '#ffffff' : '#374151',
      minHeight: '48px',
      boxShadow: state.isFocused
        ? `0 0 0 2px ${theme === 'dark' ? '#1e40af' : '#93c5fd'}`
        : 'none',
      '&:hover': {
        borderColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: theme === 'dark' ? '#ffffff' : '#374151',
    }),
    input: (provided: any) => ({
      ...provided,
      color: theme === 'dark' ? '#ffffff' : '#374151',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
      border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? theme === 'dark'
          ? '#1f2937'
          : '#f3f4f6'
        : 'transparent',
      color: theme === 'dark' ? '#ffffff' : '#374151',
      '&:hover': {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
      },
    }),
    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    }),
    loadingMessage: (provided: any) => ({
      ...provided,
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      '&:hover': {
        color: theme === 'dark' ? '#ffffff' : '#374151',
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      '&:hover': {
        color: theme === 'dark' ? '#ef4444' : '#dc2626',
      },
    }),
  };

  return (
    <div className={className}>
      {label && (
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
        >
          {label}
        </label>
      )}

      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions={false}
        value={getSelectValue()}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        isClearable={isClearable}
        isLoading={isLoading}
        styles={customStyles}
        noOptionsMessage={() => noOptionsMessage}
        loadingMessage={() => 'Buscando...'}
        className="react-select-container"
        classNamePrefix="react-select"
        menuPortalTarget={menuPortalTarget ? document.body : undefined}
      />
    </div>
  );
};
