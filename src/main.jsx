import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './homepage/Home'
import { ApplicationData } from './GlobalData/ApplicationData'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApplicationData>
      <Home />
    </ApplicationData>
  </StrictMode>,
)
