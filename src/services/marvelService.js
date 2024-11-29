// src/services/marvelService.js
import md5 from 'md5';

const publicKey = import.meta.env.VITE_MARVEL_PUBLIC_API_KEY;
const privateKey = import.meta.env.VITE_MARVEL_PRIVATE_API_KEY;

const fetchCharacters = async (searchTerm, page, cardsPerPage) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);
  const response = await fetch(
    `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchTerm}&limit=${cardsPerPage}&offset=${
      (page - 1) * cardsPerPage
    }&ts=${ts}&apikey=${publicKey}&hash=${hash}`,
  );

  const data = await response.json();
  if (data.code !== 200) {
    throw new Error('Error al obtener los personajes');
  }

  return data.data.results;
};

const fetchCharacterDetails = async (id) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  const response = await fetch(
    `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`,
  );

  const data = await response.json();

  // Verifica que la respuesta contenga resultados
  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error('Detalles del personaje no encontrados');
  }

  return data.data.results[0]; // Devuelve solo el primer personaje
};

const fetchComicDetails = async (resourceURI) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);
  const response = await fetch(
    `${resourceURI}?ts=${ts}&apikey=${publicKey}&hash=${hash}`,
  );
  const data = await response.json();
  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error('Detalles del cómic no encontrados');
  }

  return data.data.results[0]; // Devuelve el primer cómic
};

const fetchCharacterSuggestions = async (searchTerm) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);
  const response = await fetch(
    `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchTerm}&limit=15&ts=${ts}&apikey=${publicKey}&hash=${hash}`,
  );
  const data = await response.json();
  if (data.code !== 200 || !data.data || !data.data.results) {
    throw new Error('Sugerencias de personajes no encontradas');
  }

  return data.data.results.map((character) => character.name);
};

// Nueva función para obtener todos los personajes con el total disponible
const fetchAllCharacters = async (page = 1, cardsPerPage = 100) => {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  try {
    const response = await fetch(
      `https://gateway.marvel.com/v1/public/characters?limit=${cardsPerPage}&offset=${
        (page - 1) * cardsPerPage
      }&ts=${ts}&apikey=${publicKey}&hash=${hash}`,
    );
    const data = await response.json();

    // Verifica que la respuesta contenga resultados
    if (data.code !== 200 || !data.data || !data.data.results) {
      throw new Error('Error al obtener los personajes');
    }

    return {
      characters: data.data.results, // Lista de personajes
      total: data.data.total, // Total de personajes disponibles
    };
  } catch (error) {
    console.error('Error fetching all characters:', error);
    return { characters: [], total: 0 }; // Si ocurre un error, retorna un objeto vacío
  }
};

export {
  fetchCharacters,
  fetchCharacterDetails,
  fetchComicDetails,
  fetchCharacterSuggestions,
  fetchAllCharacters,  // Exportamos la nueva función
};
