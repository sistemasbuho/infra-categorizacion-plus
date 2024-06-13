import { Col, Form, Row } from 'react-bootstrap';
import { useState } from 'react';

import generalStyles from '../assets/css/general.module.css';
import Select from 'react-select';

function GeneralCategorization() {
  const [opciones] = useState([
    { value: '1', label: 'Tema 1' },
    { value: '2', label: 'Tema 2' },
    { value: '3', label: 'Tema 3' },
    { value: '4', label: 'Tema 4' },
  ]);
  return (
    <section className={generalStyles.bg_sec}>
      <h4 className="mb-3">CATEGORIZACIÓN GENERAL</h4>
      <Form>
        <Row>
          <Form.Group as={Col} sm={12} md={6}>
            <Form.Label htmlFor="tags">Asignar tags al artículo</Form.Label>
            <Select options={opciones} />
          </Form.Group>

          <Form.Group as={Col} sm={12} md={6}>
            <Form.Label htmlFor="tema">Asignar temas al artículo</Form.Label>
            <Select options={opciones} />
          </Form.Group>
        </Row>
      </Form>
    </section>
  );
}

export default GeneralCategorization;
