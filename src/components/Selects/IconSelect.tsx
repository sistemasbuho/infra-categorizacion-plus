import React, { useState } from 'react';
import Select, { components } from 'react-select';
import styles from '../../assets/css/components/iconSelect.module.css';

type IconSelectProps = {
  icon: React.ReactNode;
  options: Array<{ value: string; label: string }>;
};

const IconSelect: React.FC<IconSelectProps> = ({ icon, options, ...props }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const Control = ({ children, ...controlProps }) => (
    <components.Control {...controlProps} className={`${styles.select_cont}`}>
      <div
        className={`${styles.icon_cont} ${menuIsOpen ? styles.icon_open : ''}`}
      >
        {icon}
      </div>
      {children}
    </components.Control>
  );

  const handleMenuOpen = () => {
    setMenuIsOpen(true);
  };

  const handleMenuClose = () => {
    setMenuIsOpen(false);
  };

  return (
    <Select
      {...props}
      options={options}
      components={{ Control }}
      onMenuOpen={handleMenuOpen}
      onMenuClose={handleMenuClose}
      onFocus={handleMenuOpen}
      openMenuOnFocus={true}
    />
  );
};

export default IconSelect;
