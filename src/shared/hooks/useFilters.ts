import { useState } from 'react';

export const useFilters = <T = Record<string, any>>(
  initialFilters: T = {} as T
) => {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof T, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const openFilters = () => setIsOpen(true);
  const closeFilters = () => setIsOpen(false);

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    isOpen,
    toggleFilters,
    openFilters,
    closeFilters,
  };
};
