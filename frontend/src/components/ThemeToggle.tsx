import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const stored = localStorage.getItem('pv-theme');
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    localStorage.setItem('pv-theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="btn btn-sm btn-outline-light theme-toggle-btn"
      aria-label="Toggle color theme"
      onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
