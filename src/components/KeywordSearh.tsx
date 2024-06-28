import { useState } from 'react';
import styles from '../assets/css/components/keywordSearch.module.css';
import Search from './Search';

function KeywordSearch() {
  const [input, setInput] = useState<string | null>('');
  const keywords = [
    'Calma',
    'Tranquilidad',
    'Meditación',
    'Yoga',
    'Relajación',
    'Crecer',
    'Espiritualidad',

    'Calma',
    'Tranquilidad',
    'Meditación',
    'Yoga',
    'Relajación',
    'Crecer',
    'Espiritualidad',
  ];

  return (
    <div className={styles.container}>
      <p className={styles.text_important}>
        {keywords.map((keyword, index) => {
          return `${index + 1}. ${keyword} `;
        })}
      </p>
      <div>
        <Search state={input} setState={setInput} />
      </div>
    </div>
  );
}

export default KeywordSearch;
