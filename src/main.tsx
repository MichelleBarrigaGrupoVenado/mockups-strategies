import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.tsx'

// Nota: sin <StrictMode> a propósito — react-leaflet@4 no tolera el doble montaje de efectos que
// StrictMode fuerza en desarrollo (lanza "Map container is already initialized").
createRoot(document.getElementById('root')!).render(<App />)
