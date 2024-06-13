import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faIdBadge,
  faIndent,
  faPencilSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Col, Form, Row } from 'react-bootstrap';

import IconSelect from './Selects/IconSelect';
import globalStyles from '../assets/css/general.module.css';

function ArticleCategorization() {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  return (
    <section className={`${globalStyles.bg_sec}`}>
      <Form>
        <Row>
          <Col sm={12} md={6} lg={4}>
            <Form.Label className="w-100">
              Tipo
              <IconSelect
                options={options}
                icon={<FontAwesomeIcon icon={faIndent} />}
              />
            </Form.Label>
          </Col>
          <Col sm={12} md={6} lg={4}>
            <Form.Label className="w-100">
              Fecha
              <IconSelect
                options={options}
                icon={<FontAwesomeIcon icon={faCalendar} />}
              />
            </Form.Label>
          </Col>

          <Col sm={12} md={12} lg={4}>
            <Form.Label className="w-100">
              Programa
              <IconSelect
                options={options}
                icon={<FontAwesomeIcon icon={faPencilSquare} />}
              />
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col sm={12} lg={6}>
            <Form.Label className="w-100">
              Medio
              <IconSelect
                options={options}
                icon={<FontAwesomeIcon icon={faIndent} />}
              />
            </Form.Label>
          </Col>

          <Col sm={12} lg={6}>
            <Form.Label className="w-100">
              Autor
              <IconSelect
                options={options}
                icon={<FontAwesomeIcon icon={faIdBadge} />}
              />
            </Form.Label>
          </Col>
        </Row>
      </Form>
    </section>
  );
}

export default ArticleCategorization;
