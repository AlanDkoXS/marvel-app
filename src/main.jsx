import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import {  } from "../src/context/UserContext";
import './assets/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <AppRoutes />
  </Router>,
);
