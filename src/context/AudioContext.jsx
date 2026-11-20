import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import introAudio from '../assets/audio/intro.m4a';

const FADE_STEP = 0.01;
const FADE_INTERVAL_MS = 200; // 100 steps * 200 ms = 20 s fade-out

const AudioContext = createContext(null);

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (!isAudioPlaying) return undefined;

    audioRef.current ??= new Audio(introAudio);
    const audio = audioRef.current;
    audio.volume = 1;
    // play() rejects when the browser blocks autoplay; there's nothing to do.
    audio.play().catch(() => {});

    const fadeIntervalId = setInterval(() => {
      const volume = Math.max(audio.volume - FADE_STEP, 0);
      audio.volume = volume;
      if (volume === 0) {
        clearInterval(fadeIntervalId);
        audio.pause();
      }
    }, FADE_INTERVAL_MS);

    return () => {
      clearInterval(fadeIntervalId);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isAudioPlaying]);

  const startAudio = useCallback(() => setIsAudioPlaying(true), []);
  const stopAudio = useCallback(() => setIsAudioPlaying(false), []);

  return (
    <AudioContext.Provider value={{ isAudioPlaying, startAudio, stopAudio }}>
      {children}
    </AudioContext.Provider>
  );
};
