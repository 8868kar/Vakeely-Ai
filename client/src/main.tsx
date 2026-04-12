import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.js';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Try to use env var, fallback to placeholder to prevent crashing
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'insert-your-google-client-id-here.apps.googleusercontent.com';

createRoot(rootElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
