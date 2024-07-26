import styles from '../../assets/css/components/Login.module.css';
import FormLogin from './FormLogin';

function Login() {
  return (
    <div className={styles.Login_component}>
      <div className={styles.components_cont}>
        <div>header</div>

        <div>
          <h2>Inicia sesión para poder categorizar</h2>

          <FormLogin />
        </div>

        <div>footer</div>
      </div>
    </div>
  );
}

export default Login;
