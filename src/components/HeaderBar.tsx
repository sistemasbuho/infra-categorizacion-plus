import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../assets/css/components/headerBar.module.css';

function HeaderBar() {
  return (
    <nav className={styles.container}>
      <FontAwesomeIcon icon={faCaretLeft} />
      <p>Atrás</p>
    </nav>
  );
}

export default HeaderBar;
