import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CharacterCard from '../components/CharacterCard';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import CardsPerPage from '../components/CardsPerPage';
import useFetch from '../hooks/useFetch';
import '../assets/styles/Wiki.css';
import introAudio from '../assets/audio/intro.m4a';
import { useAudio } from '../context/AudioContext';

const Wiki = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(10);
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();
  const { startAudio, stopAudio, isAudioPlaying } = useAudio();

  const {
    data: characters,
    loading,
    error,
  } = useFetch(searchTerm, page, cardsPerPage);

  const totalPages = Math.ceil(characters.length / cardsPerPage);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
      return;
    }

    if (!isAudioPlaying) {
      startAudio(introAudio);
    }

    return () => stopAudio();
  }, [navigate, startAudio, stopAudio, isAudioPlaying]);

  const handlePageChange = (newPage) => setPage(newPage);

  const handleCardsPerPageChange = (event) => {
    const newCardsPerPage = Number(event.target.value);
    setCardsPerPage(newCardsPerPage);
    setPage(1);
  };

  return (
    <Layout backgroundImage={backgroundImage}>
      <h1>Welcome {localStorage.getItem('user')}</h1>
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for characters"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CardsPerPage
        cardsPerPage={cardsPerPage}
        handleCardsPerPageChange={handleCardsPerPageChange}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="container__cards">
          {characters.length > 0 ? (
            characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                updateBackground={setBackgroundImage}
                clearBackground={() => setBackgroundImage('')}
              />
            ))
          ) : (
            <p>No characters found with that name</p>
          )}
        </div>
      )}
      <Pagination
        page={page}
        handlePageChange={handlePageChange}
        totalPages={totalPages}
      />
    </Layout>
  );
};

export default Wiki;
