import {createRoot} from 'react-dom/client';
import { supabase } from './lib/supabase';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Ensure Supabase client is initialized and globally accessible in browser scope
if (typeof window !== 'undefined') {
  (window as any).supabase = supabase;
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
