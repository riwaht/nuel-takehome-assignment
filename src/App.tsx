import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Dashboard from './components/Dashboard';

function App(): JSX.Element {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Dashboard />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;