import { Dispatch, SetStateAction } from 'react';

import styles from '../../assets/css/components/Login.module.css';
import GoogleLoginButton from './GoogleLoginButton';

interface Props {
  setShow: Dispatch<SetStateAction<boolean>>;
}

function Login({ setShow }: Props) {
  return (
    <div className={styles.Login}>
      <div className={styles.login_modal}>
        <div className={styles.header}>
          <h4>Te damos la bienvenida al módulo de categorización</h4>
        </div>

        <div className={styles.body}>
          <p>Por favor inicia sesión con tu cuenta empresarial</p>

          <GoogleLoginButton setShow={setShow} />
        </div>
      </div>
    </div>
  );
}

export default Login;
