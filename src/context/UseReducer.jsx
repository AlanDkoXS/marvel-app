import React, { createContext, useReducer, useContext } from 'react';

const initialState = {
  user: localStorage.getItem('user') || '',
  searchTerm: '',
  characters: [],
  page: 1,
};

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

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
