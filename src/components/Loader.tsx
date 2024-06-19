import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import styles from '../assets/css/components/Loader.module.css';

interface Props {
  isLoading: boolean;
}

function Loader({ isLoading }: Props): React.ReactElement {
  const containerLoader = useRef(null);

  function closeLoader() {
    if (isLoading === false) {
      containerLoader.current.className = 'spinner-background close_container';
    }
  }

  useEffect(() => {
    closeLoader();
    return () => {};
  }, [isLoading]);

  return (
    <div className={styles.container} ref={containerLoader}>
      <FontAwesomeIcon fontSize={50} icon={faSpinner} spin />
    </div>
  );
}

export default Loader;
