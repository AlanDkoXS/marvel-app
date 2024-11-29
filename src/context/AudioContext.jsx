import React, { createContext, useContext, useState, useEffect } from 'react';
import introAudio from '../assets/audio/intro.m4a'; // Ruta al archivo de audio

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [audio] = useState(new Audio(introAudio));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Iniciar el audio solo cuando el componente se monta
    if (isPlaying) {
      audio.play();
      fadeOutAudio();
    }

    // Limpiar cuando el componente se desmonte
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, isPlaying]);

  // Función para disminuir el volumen
  const fadeOutAudio = () => {
    let volume = 1; // Volumen inicial (100%)
    const fadeDuration = 60000; // Duración del fade-out en milisegundos (30 segundos)
    const fadeInterval = 300; // Cada cuánto disminuir el volumen (en milisegundos)

    const fadeIntervalId = setInterval(() => {
      volume -= 0.01; // Reducir el volumen en cada intervalo
      if (volume <= 0) {
        clearInterval(fadeIntervalId); // Detener la reducción del volumen cuando llegue a 0
        audio.pause(); // Detener el audio
      }
      audio.volume = Math.max(volume, 0); // Asegurarse de que el volumen no sea menor que 0
    }, fadeInterval);
  };

  const startAudio = () => {
    setIsPlaying(true);
  };

  const stopAudio = () => {
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider value={{ startAudio, stopAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
