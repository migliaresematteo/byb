import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// Only render the React app if we're not on the admin page
if (!window.location.pathname.startsWith('/admin')) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StrictMode>
    );
  }
}
