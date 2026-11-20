import { useState, useEffect } from 'react';
import md5 from 'md5';

const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_API_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_API_KEY;

const BASE_URL = 'https://gateway.marvel.com/v1/public';

// Signs and sends a GET request to the Marvel API and returns `data`
// (`{ results, total, ... }`).
const marvelGet = async (path, params = {}, errorMessage = 'Request failed') => {
  const ts = Date.now();
  const queryParams = new URLSearchParams({
    ...params,
    ts,
    apikey: publicKey,
    hash: md5(ts + privateKey + publicKey),
  });

  const response = await fetch(`${BASE_URL}${path}?${queryParams}`);
  const data = await response.json();

  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error(errorMessage);
  }

  return data.data;
};

const toCharacter = (character) => ({
  id: character.id,
  name: character.name,
  description: character.description || 'No description available',
  thumbnail: character.thumbnail,
  comics: character.comics,
  stories: character.stories,
  series: character.series,
});

const fetchCharacters = async (searchTerm = '', page = 1, cardsPerPage = 10) => {
  const params = {
    limit: cardsPerPage,
    offset: (page - 1) * cardsPerPage,
  };
  if (searchTerm) {
    params.nameStartsWith = searchTerm;
  }

  const { results, total } = await marvelGet(
    '/characters',
    params,
    'Error getting characters or no characters found',
  );

  return { characters: results.map(toCharacter), total };
};

const fetchCharacterDetails = async (name) => {
  const { results } = await marvelGet(
    '/characters',
    { name },
    'Character details not found',
  );

  if (results.length === 0) {
    throw new Error('Character details not found');
  }

  return toCharacter(results[0]);
};

// One request per collection (up to 20 items), instead of one per item.
const fetchCharacterCollection = async (characterId, collection, label) => {
  const { results } = await marvelGet(
    `/characters/${characterId}/${collection}`,
    { limit: 20 },
    `${label} not found`,
  );
  return results;
};

const fetchComics = (characterId) =>
  fetchCharacterCollection(characterId, 'comics', 'Comics');
const fetchSeries = (characterId) =>
  fetchCharacterCollection(characterId, 'series', 'Series');
const fetchStories = (characterId) =>
  fetchCharacterCollection(characterId, 'stories', 'Stories');

const useFetch = (searchTerm = '', page = 1, cardsPerPage = 10) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchCharacters(searchTerm, page, cardsPerPage);
        if (!ignore) {
          setData(result.characters);
          setTotal(result.total);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Failed to fetch characters');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, [searchTerm, page, cardsPerPage]);

  return { data, total, loading, error };
};

export {
  fetchCharacters,
  fetchCharacterDetails,
  fetchComics,
  fetchStories,
  fetchSeries,
};
export default useFetch;
