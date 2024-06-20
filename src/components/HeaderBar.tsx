import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from '../assets/css/components/headerBar.module.css';
import { useNavigate } from 'react-router';

function HeaderBar() {
  const navigate = useNavigate();
  function exit() {
    navigate(-1);
  }

  return (
    <nav className={styles.container}>
      <div onClick={exit}>
        <FontAwesomeIcon icon={faCaretLeft} />
        <p>Atrás</p>
      </div>

      <div className="d-flex gap-3">
        <button className={`${styles.btn} ${styles.btn_delete}`}>
          Eliminar articulo
        </button>
        <button className={`${styles.btn} ${styles.btn_finish}`}>Finalizar</button>
      </div>
    </nav>
  );
}

export default HeaderBar;
