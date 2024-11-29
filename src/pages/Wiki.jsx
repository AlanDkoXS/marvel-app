import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CharacterCard from '../components/CharacterCard';
import {
  fetchCharacters,
  fetchCharacterSuggestions,
  fetchAllCharacters,
} from '../services/marvelService';
import Loading from '../components/Loading';
import Search from '../components/Search';
import Pagination from '../components/Pagination';
import CardsPerPage from '../components/CardsPerPage';
import '../assets/styles/Wiki.css';
import introAudio from '../assets/audio/intro.m4a'; // Ruta al archivo de audio

// Estado inicial
const initialState = {
  searchTerm: '',
  characters: [],
  suggestions: [],
  page: 1,
  loading: false,
  errors: {
    searchTerm: '',
  },
  cardsPerPage: 10,
  isSearching: false,
  totalCharacters: 0,
};

// Reductor para manejar el estado
function wikiReducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_CHARACTERS':
      return { ...state, characters: action.payload };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_CARDS_PER_PAGE':
      return { ...state, cardsPerPage: action.payload };
    case 'SET_IS_SEARCHING':
      return { ...state, isSearching: action.payload };
    case 'SET_TOTAL_CHARACTERS':
      return { ...state, totalCharacters: action.payload };
    default:
      return state;
  }
}

const Wiki = () => {
  const [state, dispatch] = useReducer(wikiReducer, initialState);
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();

  // Reproductor de audio
  const audio = new Audio(introAudio);
  audio.loop = false; // No repetir el audio
  audio.volume = 1; // Volumen inicial a 100%

  // Función para reducir el volumen del audio
  const fadeOutAudio = () => {
    let volume = 1; // Volumen inicial (100%)
    const fadeDuration = 60000; // Duración del fade-out en milisegundos (30 segundos)
    const fadeInterval = 300; // Cada cuánto disminuir el volumen (en milisegundos)

    // Intervalo para reducir el volumen progresivamente
    const fadeIntervalId = setInterval(() => {
      volume -= 0.01; // Reducir el volumen en cada intervalo
      if (volume <= 0) {
        clearInterval(fadeIntervalId); // Detener la reducción del volumen cuando llegue a 0
        audio.pause(); // Detener el audio
      }
      audio.volume = Math.max(volume, 0); // Asegurarse de que el volumen no sea menor que 0
    }, fadeInterval);
  };

  // Usar useEffect para reproducir el audio cuando el componente se monte
  useEffect(() => {
    // Verificar si hay un usuario, si no redirigir a Home
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    }

    // Reproducir el audio y aplicar fade-out
    audio.play(); // Reproducir el audio cuando la página cargue
    fadeOutAudio(); // Comenzar el fade-out del audio

    // Limpiar el audio cuando el componente se desmonte
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [navigate]); // Este efecto solo se ejecuta una vez, al montar el componente

  // Obtener todos los personajes cuando no hay búsqueda activa
  useEffect(() => {
    const fetchAll = async () => {
      if (!state.isSearching) {
        try {
          const { characters, total } = await fetchAllCharacters(
            state.page,
            state.cardsPerPage,
          );

          dispatch({ type: 'SET_CHARACTERS', payload: characters });
          dispatch({ type: 'SET_TOTAL_CHARACTERS', payload: total });
        } catch (error) {
          console.error('Error al obtener todos los personajes', error);
        }
      }
    };
    fetchAll();
  }, [state.page, state.cardsPerPage, state.isSearching]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    dispatch({ type: 'SET_SEARCH_TERM', payload: query });

    if (!query) {
      dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
      return;
    }

    try {
      const fetchedSuggestions = await fetchCharacterSuggestions(query);
      dispatch({ type: 'SET_SUGGESTIONS', payload: fetchedSuggestions });
    } catch (error) {
      console.error('Error al obtener las sugerencias', error);
    }
  };

  const handleSearch = async () => {
    if (!state.searchTerm) {
      dispatch({
        type: 'SET_ERRORS',
        payload: { searchTerm: 'Por favor, ingresa un nombre de personaje' },
      });
      return;
    }
    dispatch({ type: 'SET_ERRORS', payload: { searchTerm: '' } });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_IS_SEARCHING', payload: true });

    try {
      const fetchedCharacters = await fetchCharacters(
        state.searchTerm,
        state.page,
        state.cardsPerPage,
      );
      if (fetchedCharacters.length === 0) {
        dispatch({
          type: 'SET_ERRORS',
          payload: {
            searchTerm: 'No se encontraron personajes con ese nombre',
          },
        });
      } else {
        dispatch({ type: 'SET_CHARACTERS', payload: fetchedCharacters || 0 });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERRORS',
        payload: { searchTerm: 'Hubo un problema al buscar los personajes' },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handlePageChange = (newPage) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
  };

  const totalPages = Math.ceil(state.totalCharacters / state.cardsPerPage);

  const handleCardsPerPageChange = async (event) => {
    const newCardsPerPage = Number(event.target.value);
    dispatch({
      type: 'SET_CARDS_PER_PAGE',
      payload: newCardsPerPage,
    });
    dispatch({ type: 'SET_PAGE', payload: 1 });

    if (state.isSearching) {
      await handleSearch();
    } else {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const { characters, total } = await fetchAllCharacters(
          state.page,
          state.cardsPerPage,
        );
        dispatch({ type: 'SET_CHARACTERS', payload: characters });
        dispatch({ type: 'SET_TOTAL_CHARACTERS', payload: total });
      } catch (error) {
        console.error('Error al obtener todos los personajes', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: suggestion });
    dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
    await handleSearch();
  };

  // Actualizar el fondo
  const updateBackground = (imageUrl) => {
    setBackgroundImage(imageUrl);
  };

  const clearBackground = () => {
    setBackgroundImage('');
  };

  return (
    <Layout backgroundImage={backgroundImage}>
      <h1>Bienvenido {localStorage.getItem('user')}</h1>

      {/* Sección de búsqueda */}
      <Search
        searchTerm={state.searchTerm}
        handleSearch={handleSearch}
        suggestions={state.suggestions}
        errors={state.errors}
        handleSearchChange={handleSearchChange}
        handleSuggestionClick={handleSuggestionClick}
        handleCardsPerPageChange={handleCardsPerPageChange}
        cardsPerPage={state.cardsPerPage}
      />

      {/* Componente CardsPerPage */}
      <CardsPerPage
        cardsPerPage={state.cardsPerPage}
        handleCardsPerPageChange={handleCardsPerPageChange}
      />

      {/* Mostrar personajes buscados */}
      {state.loading ? (
        <Loading />
      ) : (
        <div className="container__cards">
          {state.characters.length > 0 ? (
            state.characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                updateBackground={updateBackground}
                clearBackground={clearBackground}
              />
            ))
          ) : (
            <p>No se encontraron personajes con ese nombre</p>
          )}
        </div>
      )}

      {/* Paginación */}
      <Pagination
        page={state.page}
        handlePageChange={handlePageChange}
        cardsPerPage={state.cardsPerPage}
        totalPages={totalPages}
      />
    </Layout>
  );
};

export default Wiki;
