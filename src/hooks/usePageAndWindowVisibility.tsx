import { useEffect, useState } from 'react';

const usePageAndWindowVisibility = () => {
  const [isVisible, setIsVisible] = useState<boolean>(!document.hidden && document.hasFocus());

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden && document.hasFocus());
    };

    const handleFocus = () => {
      setIsVisible(true);
    };

    const handleBlur = () => {
      setIsVisible(false);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return isVisible;
};

export default usePageAndWindowVisibility;
