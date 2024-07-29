import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.scss"
import { AuthContextProvider } from './context/AuthContext.jsx'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
    <SocketContextProvider>
      <GoogleOAuthProvider clientId="427073888233-i81pnt4cj3nu6f7b35lhai8g1eaaihed.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
    </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)