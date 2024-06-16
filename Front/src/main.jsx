import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import createRouter from './router.jsx' 
import { ContextProvider } from './context/ContextProvider.jsx' 
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <ContextProvider>
    <RouterProvider router={createRouter("hello")}/>
    </ContextProvider>
  </React.StrictMode>,
)