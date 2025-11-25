import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// import TestApp from './TestApp.tsx';
// import SimpleApp from './SimpleApp.tsx';
import { AppProvider } from './context/AppContext';
import './index.css';

console.log('🚀 [main.tsx] Starting application...');
console.log('🚀 [main.tsx] Environment:', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  apiUrl: import.meta.env.VITE_API_URL,
  appUrl: import.meta.env.VITE_APP_URL
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);

console.log('🚀 [main.tsx] React root created and rendering...');
