// src/components/Config.tsx
import React from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from '../../controls/ToggleSwitch';

const Config: React.FC = () => {
  const { fontSize, setFontSize, darkMode, toggleDarkMode } = useConfig();

  return (
    <>
      <div>
        <h2>Personalización</h2>
      </div>

      <div>
        <div className="d-flex gap-3 justify-content-between align-items-center">
          <p className="m-0">Tamaño letra</p>

          <div className="d-flex gap-2 align-items-center">
            <button onClick={() => setFontSize((prev) => prev - 2)}>
              <FontAwesomeIcon icon={faMinus} />
            </button>

            <h3>Aa</h3>
            <button onClick={() => setFontSize((prev) => prev + 2)}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>

        <div className="d-flex gap-3 justify-content-between align-items-center">
          <p className=" m-0">Modo oscuro</p>
          <ToggleSwitch checked={darkMode} onChange={toggleDarkMode} />
        </div>
      </div>
    </>
  );
};

export default Config;
