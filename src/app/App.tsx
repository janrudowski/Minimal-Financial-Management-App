import '../style.css';
import { cn } from '../shared/utils/cn';
import { useDarkMode } from './providers/DarkModeProvider';
import { AppRouter } from './router/AppRouter';

export default function App() {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={cn(
        'flex min-h-screen flex-col bg-app-bg text-app-text transition-colors duration-300 lg:flex-row',
        darkMode && 'dark bg-app-dark-bg text-slate-50'
      )}
    >
      <AppRouter />
    </div>
  );
}
