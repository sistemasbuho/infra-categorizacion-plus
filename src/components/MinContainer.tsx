import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

import styles from '../assets/css/components/minContainer.module.css';

interface ContainerProps {
  title: string;
  isDeployable: boolean;
  defaultOpened?: boolean;
  children: React.ReactNode;
}

function MinContainer({
  children,
  title,
  defaultOpened = false,
  isDeployable = false,
}: ContainerProps) {
  const [open, setOpen] = useState(defaultOpened);

  return (
    <section className={styles.container}>
      <div>
        <h2>{title}</h2>

        {isDeployable && (
          <button onClick={() => setOpen((prev) => !prev)}>
            <FontAwesomeIcon
              icon={faCaretUp}
              style={{
                transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s',
              }}
            />
          </button>
        )}
      </div>
      {open && <div>{children}</div>}
    </section>
  );
}

export default MinContainer;
