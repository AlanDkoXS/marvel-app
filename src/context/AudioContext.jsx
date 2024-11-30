import React, { createContext, useContext, useState, useEffect } from 'react';
import introAudio from '../assets/audio/intro.m4a';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [audio] = useState(new Audio(introAudio));
  const [isPlaying, setIsPlaying] = useState(false);

  // Efecto para reproducir el audio cuando 'isPlaying' sea true
  useEffect(() => {
    if (isPlaying) {
      audio.play();
      fadeOutAudio();
    }

    return () => {
      // Limpiar y detener el audio cuando el componente se desmonte
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, isPlaying]);

  // Función para hacer el fade out del audio
  const fadeOutAudio = () => {
    let volume = 1;
    const fadeDuration = 60000; // Duración en ms para que el audio se desvanezca
    const fadeInterval = 200; // Intervalo de tiempo para reducir el volumen

    const fadeIntervalId = setInterval(() => {
      volume -= 0.01; // Reducir el volumen poco a poco
      if (volume <= 0) {
        clearInterval(fadeIntervalId);
        audio.pause(); // Pausar el audio cuando el volumen llegue a 0
      }
      audio.volume = Math.max(volume, 0); // Asegurarse de que el volumen no sea negativo
    }, fadeInterval);
  };

  // Función para iniciar la reproducción del audio
  const startAudio = () => {
    setIsPlaying(true); // Esto activará el 'useEffect' para reproducir el audio
  };

  // Función para detener el audio inmediatamente
  const stopAudio = () => {
    setIsPlaying(false); // Esto pausará el audio
  };

  return (
    <AudioContext.Provider value={{ startAudio, stopAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
