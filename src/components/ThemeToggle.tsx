import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg border border-brand-grayMid dark:border-brand-navy bg-white dark:bg-brand-navy text-brand-grayText dark:text-brand-grayLight hover:bg-brand-grayLight dark:hover:bg-brand-navy/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 dark:focus:ring-offset-brand-navy"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute top-0 left-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 opacity-100' 
              : 'rotate-90 opacity-0'
          }`} 
        />
        <Moon 
          className={`absolute top-0 left-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 opacity-100' 
              : '-rotate-90 opacity-0'
          }`} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
