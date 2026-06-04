import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem('pawlens-theme') === 'dark'; }
    catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('pawlens-theme', isDark ? 'dark' : 'light'); } catch {}
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
