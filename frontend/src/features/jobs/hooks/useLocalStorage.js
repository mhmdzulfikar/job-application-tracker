import { useState, useEffect } from "react";

// Ini alat pabrik kita, Bos!
function useLocalStorage(key, initialValue) {
  // 1. Cek brankas lokal pas pertama kali load
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Gagal baca LocalStorage Bos:", error);
      return initialValue;
    }
  });

  // 2. Otomatis nyimpen tiap kali datanya berubah (Ini gantiin useEffect lu!)
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Gagal nyimpen ke LocalStorage Bos:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;