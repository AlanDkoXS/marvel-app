import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../app/Home';
import Wiki from '../app/Wiki';
import WikiDetails from '../app/WikiDetails';
import { AudioProvider } from '../context/AudioContext';
import { BackgroundProvider } from '../context/BackgroundContext';
import '../assets/styles/App.css';
import useFetch from '../hooks/useFetch';

function AppRoutes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { data: characters, loading, error } = useFetch(searchTerm, page, 10);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <AudioProvider>
      <BackgroundProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/wiki/:name" element={<WikiDetails />} />
        </Routes>
      </BackgroundProvider>
    </AudioProvider>
  );
}

export default AppRoutes;
