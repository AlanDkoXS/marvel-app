import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Search from '../components/Search';
import CharacterCard from '../components/CharacterCard';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import CardsPerPage from '../components/CardsPerPage';
import useFetch from '../hooks/useFetch';
import '../assets/styles/Wiki.css';
import { useAudio } from '../context/AudioContext';
import { useBackground } from '../context/BackgroundContext';

const Wiki = () => {
  const [searchTerm, setSearchTerm] = useState('captain');
  const [page, setPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(10);
  const { backgroundImage, setBackgroundImage, clearBackground } =
    useBackground();
  const { startAudio, stopAudio } = useAudio();

  const {
    data: characters,
    total,
    loading,
    error,
  } = useFetch(searchTerm, page, cardsPerPage);

  const totalPages = Math.ceil(total / cardsPerPage);

  useEffect(() => {
    startAudio();
    return stopAudio;
  }, [startAudio, stopAudio]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1);
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const handleCardsPerPageChange = (event) => {
    setCardsPerPage(Number(event.target.value));
    setPage(1);
  };

  return (
    <Layout backgroundImage={backgroundImage}>
      <h1>Welcome {localStorage.getItem('user')}</h1>
      <Search handleSearch={handleSearch} />
      <CardsPerPage
        cardsPerPage={cardsPerPage}
        handleCardsPerPageChange={handleCardsPerPageChange}
      />
      {loading ? (
        <Loading />
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="container__cards">
          {characters.length > 0 ? (
            characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                updateBackground={setBackgroundImage}
                clearBackground={clearBackground}
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
