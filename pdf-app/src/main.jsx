import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { BgDarkenContextWrapper } from './components/context/backgroundDarkenContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BgDarkenContextWrapper>
    <Router>
      <App />
    </Router>
    </BgDarkenContextWrapper>
  </StrictMode>,
)
