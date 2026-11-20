import { createContext, useState, useContext, useCallback } from 'react';

const BackgroundContext = createContext(null);

export const BackgroundProvider = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const clearBackground = useCallback(() => setBackgroundImage(''), []);

  return (
    <BackgroundContext.Provider
      value={{ backgroundImage, setBackgroundImage, clearBackground }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundContext);
