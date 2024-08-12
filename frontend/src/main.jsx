import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { SocketContextProvider } from './context/SocketContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_APP_CLIENT_ID;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
