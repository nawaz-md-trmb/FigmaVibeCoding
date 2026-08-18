import '@trimble-oss/moduswebcomponents/modus-wc-styles.css'
import { ModusWcThemeProvider, setAssetPath } from '@trimble-oss/moduswebcomponents-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if (typeof window !== 'undefined') {
  const base = import.meta.env.BASE_URL || '/'
  setAssetPath(`${window.location.origin}${base.endsWith('/') ? base : `${base}/`}`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModusWcThemeProvider>
      <App />
    </ModusWcThemeProvider>
  </StrictMode>,
)
