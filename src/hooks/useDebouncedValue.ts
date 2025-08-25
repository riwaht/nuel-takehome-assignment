import { useState, useEffect } from 'react';

/**
 * Debounces a value to prevent excessive updates.
 * The returned value identity is stable during the debounce period.
 */
function useDebouncedValue<T>(value: T, ms: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), ms);
    return () => clearTimeout(timeout);
  }, [value, ms]);
  
  return debouncedValue;
}

export default useDebouncedValue;
