import React, { createContext, useContext, useState, useEffect } from 'react';
import introAudio from '../assets/audio/intro.m4a';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [audio] = useState(new Audio(introAudio));
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      audio.play();
      fadeOutAudio();
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio, isPlaying]);

  const fadeOutAudio = () => {
    let volume = 1;
    const fadeDuration = 60000;
    const fadeInterval = 200;

    const fadeIntervalId = setInterval(() => {
      volume -= 0.01;
      if (volume <= 0) {
        clearInterval(fadeIntervalId);
        audio.pause();
      }
      audio.volume = Math.max(volume, 0);
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
