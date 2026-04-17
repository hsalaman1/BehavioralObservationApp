import { useEffect, useState } from 'react';

export function useKeyboardVisible() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const vv = window.visualViewport;
    const baseline = window.innerHeight;

    const handler = () => {
      const shrink = baseline - vv.height;
      setKeyboardVisible(shrink > 150);
    };

    vv.addEventListener('resize', handler);
    return () => vv.removeEventListener('resize', handler);
  }, []);

  return keyboardVisible;
}
