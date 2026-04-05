import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// XÓA HOẶC COMMENT DÒNG DƯỚI ĐÂY:
// import './index.css' 
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)