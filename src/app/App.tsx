import '../style.css';
import { useDarkMode } from './providers/DarkModeProvider';
import { AppRouter } from './router/AppRouter';

export default function App() {
  const { darkMode } = useDarkMode();

  return (
    <div className={`flex ${darkMode ? 'flex-dark' : ''}`}>
      <AppRouter />
    </div>
  );
}
