import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Zilk Co. is always dark — set immediately before first paint
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(<App />);
