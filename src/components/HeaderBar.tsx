import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../assets/css/components/headerBar.module.css';

function HeaderBar() {
  return (
    <nav className={styles.container}>
      <div>
        <FontAwesomeIcon icon={faCaretLeft} />
        <p>Atrás</p>
      </div>

      <button className={styles.btn}>Finalizar</button>
    </nav>
  );
}

export default HeaderBar;
