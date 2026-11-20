import { useEffect, useDeferredValue, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import Layout from '../components/Layout';
import Search from '../components/Search';
import CharacterCard from '../components/CharacterCard';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import CardsPerPage, { PER_PAGE_OPTIONS } from '../components/CardsPerPage';
import useCharacters from '../hooks/useCharacters';
import { searchCharacters } from '../utils/search';
import '../assets/styles/Wiki.css';
import { useAudio } from '../context/AudioContext';
import { useBackground } from '../context/BackgroundContext';

const DEFAULT_PER_PAGE = PER_PAGE_OPTIONS[0];

const Wiki = () => {
  // Search state lives in the URL (?q=&page=&per=), so going back from a
  // character's page restores the same results.
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const perParam = Number(params.get('per'));
  const cardsPerPage = PER_PAGE_OPTIONS.includes(perParam)
    ? perParam
    : DEFAULT_PER_PAGE;

  const { characters, loading, error, retry } = useCharacters();
  const { backgroundImage, setBackgroundImage, clearBackground } =
    useBackground();
  const { startAudio, stopAudio } = useAudio();

  // Filtering runs on every keystroke; deferring keeps typing responsive.
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(
    () => searchCharacters(characters, deferredQuery),
    [characters, deferredQuery],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / cardsPerPage));
  const page = Math.min(Math.max(Number(params.get('page')) || 1, 1), totalPages);
  const visible = results.slice((page - 1) * cardsPerPage, page * cardsPerPage);

  useEffect(() => {
    startAudio();
    return stopAudio;
  }, [startAudio, stopAudio]);

  // Sets the given params, dropping empty/default values from the URL.
  const updateParams = (changes, { replace = false } = {}) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(changes).forEach(([key, value]) => {
          if (value === '' || value === null) next.delete(key);
          else next.set(key, String(value));
        });
        if (next.get('page') === '1') next.delete('page');
        if (next.get('per') === String(DEFAULT_PER_PAGE)) next.delete('per');
        return next;
      },
      { replace },
    );
  };

  const handleSearch = (newQuery) =>
    updateParams({ q: newQuery, page: null }, { replace: true });

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardsPerPageChange = (event) =>
    updateParams({ per: Number(event.target.value), page: null });

  const renderResults = () => {
    if (loading) return <Loading />;
    if (error)
      return (
        <div className="panel wiki__message">
          <p>Error: {error}</p>
          <button onClick={retry}>Try again</button>
        </div>
      );
    if (results.length === 0)
      return (
        <div className="panel wiki__message">
          <p>No characters match &ldquo;{query}&rdquo;</p>
        </div>
      );

    return (
      <div className="container__cards">
        {visible.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            updateBackground={setBackgroundImage}
            clearBackground={clearBackground}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout backgroundImage={backgroundImage}>
      <h1 className="welcome">Welcome, {localStorage.getItem('user')}!</h1>
      <Search
        value={query}
        onChange={handleSearch}
        resultCount={loading || error ? null : results.length}
      />
      <CardsPerPage
        cardsPerPage={cardsPerPage}
        handleCardsPerPageChange={handleCardsPerPageChange}
      />
      {renderResults()}
      {!loading && !error && results.length > 0 && (
        <Pagination
          page={page}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      )}
    </Layout>
  );
};

export default Wiki;
