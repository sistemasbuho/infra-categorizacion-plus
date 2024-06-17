// src/components/ToggleSwitch.tsx
import React from 'react';
import styles from '../../assets/css/components/controls/toggleSwitch.module.css'; // Asegúrate de importar el archivo CSS

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <div className={styles.toggle_switch}>
      <label className={styles.switch}>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className={styles.slider}></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
