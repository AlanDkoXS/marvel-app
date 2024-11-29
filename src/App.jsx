import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Wiki from './pages/Wiki';
import WikiDetails from './pages/WikiDetails';
import { AudioProvider } from './context/AudioContext';
import './assets/styles/App.css';

function App() {
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

export default App;
