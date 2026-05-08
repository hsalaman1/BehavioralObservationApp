import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { ErrorBoundary } from './components/UI/ErrorBoundary'

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onOfflineReady() {
      try {
        window.localStorage.setItem('pwa-offline-ready', '1');
      } catch {
        // localStorage can throw in private mode; the in-memory event still fires.
      }
      window.dispatchEvent(new CustomEvent('app:offline-ready'));
    },
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 60 * 1000);
      }
    },
  });
  // updateSW is intentionally retained for autoUpdate side effects.
  void updateSW;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
