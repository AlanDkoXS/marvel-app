import { useReducer, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import {
  fetchCharacters,
  fetchCharacterSuggestions,
} from '../services/marvelService';

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

export function useWiki() {
  const [state, dispatch] = useReducer(wikiReducer, initialState);
  const navigate = useNavigate();
  const cardsPerPageRef = useRef(10);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/');
    }
  }, [navigate]);

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
        cardsPerPageRef.current,
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

  const handlePageChange = async (newPage) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
    await handleSearch();
  };

  const totalPages = Math.max(
    1,
    Math.ceil(state.total / cardsPerPageRef.current),
  );

  const handleCardsPerPageChange = async (event) => {
    const newCardsPerPage = Number(event.target.value);
    cardsPerPageRef.current = newCardsPerPage;
    dispatch({ type: 'SET_PAGE', payload: 1 });

    if (state.isSearching) {
      await handleSearch();
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
    handleSuggestionClick,
    totalPages,
  };
}
