import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SleepApp from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SleepApp />
  </StrictMode>
);
