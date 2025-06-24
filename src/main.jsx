// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './lib/i18n';

// Imports the Provider component you just authored.
import { AuthProvider } from './contexts/AuthContext.jsx'; // 1. Import AuthProvider

// React 18 root API mounts your whole app.
ReactDOM.createRoot(document.getElementById('root')).render(
  // Wraps everything in <React.StrictMode> which runs extra dev-only checks such as double-invoking effects. 
  <React.StrictMode>
    { /*Embeds <App /> inside <AuthProvider> so every component gains access to useAuth(); prop-drilling is eliminated.*/ }
    <AuthProvider>
      <App />
    </AuthProvider>
    {/* Closes JSX and render(); trailing comma is allowed in JavaScript function calls. */}
  </React.StrictMode>,
);