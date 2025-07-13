import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// import TestApp from './TestApp.tsx';
// import SimpleApp from './SimpleApp.tsx';
import { SimpleAppProvider } from './context/SimpleAppContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleAppProvider>
      <App />
    </SimpleAppProvider>
  </StrictMode>
);
