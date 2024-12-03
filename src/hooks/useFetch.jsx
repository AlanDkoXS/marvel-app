import { useState, useEffect } from 'react';
import md5 from 'md5';

const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_API_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_API_KEY;

const fetchCharacters = async (
  searchTerm = '',
  page = 1,
  cardsPerPage = 10,
) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  const baseUrl = `https://gateway.marvel.com/v1/public/characters`;
  const queryParams = new URLSearchParams({
    ts,
    apikey: publicKey,
    hash,
    limit: cardsPerPage,
    offset: (page - 1) * cardsPerPage,
  });

  if (searchTerm) {
    queryParams.append('nameStartsWith', searchTerm);
  }

  const response = await fetch(`${baseUrl}?${queryParams.toString()}`);
  const data = await response.json();

  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error('Error getting characters or no characters found');
  }

  return data.data.results.map((character) => {
    if (!character.id) {
      console.warn('Character id missing:', character);
    }

    return {
      id: character.id || null,
      name: character.name,
      description: character.description || 'No description available',
      thumbnail: character.thumbnail,
      comics: character.comics,
      stories: character.stories,
      series: character.series,
    };
  });
};

const fetchCharacterDetails = async (name) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  const queryParams = new URLSearchParams({
    ts,
    apikey: publicKey,
    hash,
    name: name,
  });

  const response = await fetch(
    `https://gateway.marvel.com/v1/public/characters?${queryParams.toString()}`,
  );

  const data = await response.json();

  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error('Character details not found');
  }

  return {
    id: data.data.results[0].id,
    name: data.data.results[0].name,
    description: data.data.results[0].description || 'No description available',
    thumbnail: data.data.results[0].thumbnail,
    comics: data.data.results[0].comics,
    stories: data.data.results[0].stories,
    series: data.data.results[0].series,
  };
};

const fetchComics = async (resourceURI) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  const response = await fetch(
    `${resourceURI}?ts=${ts}&apikey=${publicKey}&hash=${hash}`,
  );

  const data = await response.json();

  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error('Comic details not found');
  }

  return data.data.results[0];
};

const fetchStories = async (resourceURI) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  const response = await fetch(
    `${resourceURI}?ts=${ts}&apikey=${publicKey}&hash=${hash}`,
  );

  const data = await response.json();

  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error('Story details not found');
  }

  return data.data.results[0];
};

const fetchSeries = async (resourceURI) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  const response = await fetch(
    `${resourceURI}?ts=${ts}&apikey=${publicKey}&hash=${hash}`,
  );

  const data = await response.json();

  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error('Series details not found');
  }

  return data.data.results[0];
};

const useFetch = (searchTerm = '', page = 1, cardsPerPage = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedData = await fetchCharacters(
          searchTerm,
          page,
          cardsPerPage,
        );
        setData(fetchedData);
      } catch (err) {
        setError(err.message || 'Failed to fetch characters');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchTerm, page, cardsPerPage]);

  return { data, loading, error };
};

export {
  fetchCharacters,
  fetchCharacterDetails,
  fetchComics,
  fetchStories,
  fetchSeries,
};
export default useFetch;
