import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import App from './App'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <PrimeReactProvider value={{}}>
      <App />
    </PrimeReactProvider>
  </StrictMode>
)
