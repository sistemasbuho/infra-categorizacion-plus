import { Form } from 'react-bootstrap';
import styles from '../../assets/css/components/Login.module.css';
import { FormEvent, useState } from 'react';

function FormLogin() {
  const [validated, setValidated] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);
  }

  return (
    <Form
      className={styles.form}
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Form.Group className={styles.cont_input}>
        <input type="email" id="email" required placeholder=" " />
        <Form.Label htmlFor="email">Correo</Form.Label>
      </Form.Group>

      <Form.Group className={styles.cont_input}>
        <input type="password" id="password" required placeholder=" " />
        <Form.Label htmlFor="password">Contraseña</Form.Label>
      </Form.Group>
    </Form>
  );
}

export default FormLogin;
