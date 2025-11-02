import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para almacenar nuestro valor
  // Pasa la función inicial al useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Para el token, no usar JSON.parse ya que es un string simple
      const parsed = key === 'auth_token' ? (item || initialValue) : (item ? JSON.parse(item) : initialValue);
      console.log(`useLocalStorage getValue for ${key}:`, parsed);
      return parsed;
    } catch (error) {
      console.log('useLocalStorage getValue error:', error);
      return initialValue;
    }
  });

  // Retorna una versión envuelta de la función setter de useState que persiste
  // el nuevo valor en localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que el valor sea una función para que tengamos la misma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      console.log(`useLocalStorage setValue for ${key}:`, valueToStore);
      setStoredValue(valueToStore);
      // Guarda en localStorage solo en el cliente
      if (typeof window !== 'undefined') {
        // Para el token, no usar JSON.stringify ya que es un string simple
        const valueToSave = key === 'auth_token' ? String(valueToStore) : JSON.stringify(valueToStore);
        window.localStorage.setItem(key, valueToSave);
        console.log(`Saved to localStorage: ${key} =`, valueToStore);
      }
    } catch (error) {
      console.log('useLocalStorage setValue error:', error);
    }
  };

  // Función para remover el valor de localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
} 