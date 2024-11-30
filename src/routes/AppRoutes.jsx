import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../app/Home';
import Wiki from '../app/Wiki';
import WikiDetails from '../app/WikiDetails';
import { AudioProvider } from '../context/AudioContext';
import '../assets/styles/App.css';

function AppRoutes() {
  return (
    <AudioProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/wiki/:id" element={<WikiDetails />} />
      </Routes>
    </AudioProvider>
  );
}

export default AppRoutes;
