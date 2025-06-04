import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

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
  const [config, setConfig] = useState<{
    fontSize: number;
    darkMode: boolean;
  } | null>({ fontSize: 20, darkMode: false });

  const setFontSize = (size: number) => {
    if (size >= 12 && size <= 28)
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

  useEffect(() => {
    if (localStorage.getItem('config')) {
      setConfig(JSON.parse(localStorage.getItem('config')));
    } else {
      localStorage.setItem(
        'config',
        JSON.stringify({ fontSize: 20, darkMode: false })
      );

      setConfig({
        fontSize: 20,
        darkMode: false,
      });
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (config) localStorage.setItem('config', JSON.stringify(config));

    return () => {};
  }, [config]);

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
