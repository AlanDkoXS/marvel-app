// src/context/useReducer.js
import React, { createContext, useReducer, useContext } from 'react';

// Estado inicial
const initialState = {
  user: localStorage.getItem('user') || '',
  searchTerm: '',
  characters: [],
  page: 1,
};

// Reducer para manejar las acciones
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      localStorage.setItem('user', action.payload);
      return { ...state, user: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_CHARACTERS':
      return { ...state, characters: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

// Crear contexto
const AppContext = createContext();

// Proveedor de contexto para envolver la aplicación
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook para acceder al estado y al dispatch
export const useAppContext = () => {
  return useContext(AppContext);
};
