import { ArticleProvider } from './context/ArticleContext';
import { useConfig } from './context/ConfigContext';

import FragmentsProvider from './context/FragmentsContext';
import ComponentManager from './ComponentManager';
import stylesGeneral from './assets/css/general.module.css';

function GlobalComponent() {
  const { darkMode } = useConfig();

  return (
    <ArticleProvider>
      <FragmentsProvider>
        <div
          className={`${stylesGeneral.App} ${darkMode && stylesGeneral.dark}`}
        >
          <ComponentManager />
        </div>
      </FragmentsProvider>
    </ArticleProvider>
  );
}

export default GlobalComponent;
