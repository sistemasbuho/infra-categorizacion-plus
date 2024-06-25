import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Config {
  fontSize: number;
  darkMode: boolean;
  toggleDarkMode: () => void;
  setFontSize: (size: number) => void;
}

interface ConfigProviderProps {
  children: ReactNode;
}

const ConfigContext = createContext<Config | undefined>(undefined);

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState({
    fontSize: 20,
    darkMode: false,
  });

  const setFontSize = (size: number) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      fontSize: size,
    }));
  };

  const toggleDarkMode = () => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      darkMode: !prevConfig.darkMode,
    }));
  };

  return (
    <ConfigContext.Provider
      value={{
        ...config,
        setFontSize,
        toggleDarkMode,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): Config => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
