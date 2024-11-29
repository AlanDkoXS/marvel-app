import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';  // Only here
import App from './App';
import './assets/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />  {/* All routes are now wrapped by the Router here */}
  </Router>
);
