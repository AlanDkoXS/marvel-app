import { useReducer, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import {
  fetchCharacters,
  fetchCharacterSuggestions,
} from '../services/marvelService';

// Estado inicial
const initialState = {
  searchTerm: '',
  characters: [],
  suggestions: [],
  topCharacters: [],
  page: 1,
  total: 0,
  loading: false,
  errors: {
    searchTerm: '',
  },
  isSearching: false,
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
    case 'SET_TOP_CHARACTERS':
      return { ...state, topCharacters: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_IS_SEARCHING':
      return { ...state, isSearching: action.payload };
    case 'SET_TOTAL':
      return { ...state, total: action.payload };
    default:
      return state;
  }
}

// Hook personalizado para manejar la lógica de Wiki
export function useWiki() {
  const [state, dispatch] = useReducer(wikiReducer, initialState);
  const navigate = useNavigate();
  const cardsPerPageRef = useRef(10); // Valor predeterminado para tarjetas por página

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    }
  }, [navigate]);

  // Manejar cambios en el término de búsqueda
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
    dispatch({ type: 'SET_PAGE', payload: 1 });
  };

  // Realizar la búsqueda de personajes
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
        cardsPerPageRef.current, // Usar el valor de cardsPerPage desde useRef
      );
      if (fetchedCharacters.results.length === 0) {
        dispatch({
          type: 'SET_ERRORS',
          payload: {
            searchTerm: 'No se encontraron personajes con ese nombre',
          },
        });
      } else {
        dispatch({ type: 'SET_CHARACTERS', payload: fetchedCharacters });
        dispatch({ type: 'SET_ERRORS', payload: { searchTerm: '' } });
        dispatch({ type: 'SET_TOTAL', payload: total || 0 });
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

  // Cambiar la página de los resultados
  const handlePageChange = async (newPage) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
    await handleSearch(); // Asegúrate de ejecutar la búsqueda para obtener los personajes de la nueva página
  };

  // Calcular el total de páginas en base a los resultados y tarjetas por página
  const totalPages = Math.max(
    1,
    Math.ceil(state.total / cardsPerPageRef.current),
  );

  // Cambiar la cantidad de tarjetas por página
const handleCardsPerPageChange = async (event) => {
    const newCardsPerPage = Number(event.target.value); // Convertir el valor a número
    cardsPerPageRef.current = newCardsPerPage; // Actualizar la referencia de cardsPerPage
    dispatch({ type: 'SET_PAGE', payload: 1 }); // Resetear la página a 1

    // Si estamos buscando, refrescar los personajes con la nueva cantidad por página
    if (state.isSearching) {
      await handleSearch(); // Hacer que handleSearch también sea asíncrono si lo es
    } else {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const topCharactersData = await fetchTopCharacters();
        dispatch({ type: 'SET_TOP_CHARACTERS', payload: topCharactersData });
      } catch (error) {
        console.error('Error al obtener los personajes más destacados', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  };


  // Manejar la selección de una sugerencia
  const handleSuggestionClick = async (suggestion) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: suggestion });
    dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
    await handleSearch();
  };

  return {
    state,
    handleSearchChange,
    handleSearch,
    handlePageChange,
    handleCardsPerPageChange,
    handleSuggestionClick, // Devolver la función
    totalPages,
  };
}
