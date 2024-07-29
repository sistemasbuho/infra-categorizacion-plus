import styles from '../../assets/css/components/Login.module.css';
import GoogleLoginButton from './GoogleLoginButton';

function Login() {
  return (
    <div className={styles.Login}>
      <div className={styles.login_modal}>
        <div className={styles.header}>
          <h4>Te damos la bienvenida al módulo de categorización</h4>
        </div>

        <div className={styles.body}>
          <p>Por favor inicia sesión con tu cuenta empresarial</p>

          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

export default Login;
