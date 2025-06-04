import { ArticleProvider } from './context/ArticleContext';
import { useConfig } from './context/ConfigContext';

import FragmentsProvider from './context/FragmentsContext';
import ArticleLayout from './ArticleLayout';
import stylesGeneral from './assets/css/general.module.css';

import './assets/css/general.module.css';

function ArticleManager() {
  const { darkMode } = useConfig();

  return (
    <ArticleProvider>
      <FragmentsProvider>
        <div
          className={`${stylesGeneral.App} ${darkMode && stylesGeneral.dark}`}
        >
          <ArticleLayout />
        </div>
      </FragmentsProvider>
    </ArticleProvider>
  );
}

export default ArticleManager;
