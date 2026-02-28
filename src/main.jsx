import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router';
import { RootProvider } from './components/providers/root-provider';
import './assets/styles/main.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <RootProvider>
      <App />
    </RootProvider>
  </BrowserRouter>,
);
