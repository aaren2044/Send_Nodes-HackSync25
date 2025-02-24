import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './Sleep.tsx';
import './Sleep.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
