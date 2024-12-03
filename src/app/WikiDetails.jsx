import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchCharacterDetails,
  fetchComics,
  fetchSeries,
  fetchStories,
} from '../hooks/useFetch'; // Asegúrate de que estas funciones estén disponibles
import { useAudio } from '../context/AudioContext';
import Layout from '../components/Layout';
import { useBackground } from '../context/BackgroundContext';
import Comics from '../components/Comics';
import Series from '../components/Series';
import Stories from '../components/Stories';
import '../assets/styles/WikiDetails.css';

const WikiDetails = () => {
  const { name } = useParams();
  const { isAudioPlaying, startAudio } = useAudio();
  const { backgroundImage } = useBackground();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [series, setSeries] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('comics');

  useEffect(() => {
    if (!isAudioPlaying) {
      startAudio('/ruta-audio/intro.m4a');
    }
  }, [isAudioPlaying, startAudio]);

  useEffect(() => {
    if (!name) {
      setError('The character name is invalid.');
      setLoading(false);
      return;
    }

    const loadCharacterData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedCharacter = await fetchCharacterDetails(name);
        setCharacter(fetchedCharacter);

        // Cargar los cómics
        if (
          fetchedCharacter.comics &&
          fetchedCharacter.comics.items.length > 0
        ) {
          const fetchedComics = await Promise.all(
            fetchedCharacter.comics.items.map((comic) =>
              fetchComics(comic.resourceURI),
            ),
          );
          setComics(fetchedComics);
        } else {
          setComics([]);
        }

        if (
          fetchedCharacter.series &&
          fetchedCharacter.series.items.length > 0
        ) {
          const fetchedSeries = await Promise.all(
            fetchedCharacter.series.items.map((serie) =>
              fetchSeries(serie.resourceURI),
            ),
          );
          setSeries(fetchedSeries);
        } else {
          setSeries([]);
        }

        if (
          fetchedCharacter.stories &&
          fetchedCharacter.stories.items.length > 0
        ) {
          const fetchedStories = await Promise.all(
            fetchedCharacter.stories.items.map((story) =>
              fetchStories(story.resourceURI),
            ),
          );
          setStories(fetchedStories);
        } else {
          setStories([]);
        }
      } catch (err) {
        setError(err.message || 'Error loading details');
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, [name]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <Layout backgroundImage={backgroundImage}>
      <div className="wiki__details">
        <div className="character__container">
          {character.thumbnail ? (
            <img
              src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
              alt={character.name}
              className="character__image"
            />
          ) : (
            <p>No image available</p>
          )}
          <h1>{character.name}</h1>
          <p>{character.description || 'No description available'}</p>
        </div>
        <Link to="/wiki">Back</Link>

        <div className="section__buttons">
          <button onClick={() => handleSectionChange('comics')}>Comics</button>
          <button onClick={() => handleSectionChange('series')}>Series</button>
          <button onClick={() => handleSectionChange('stories')}>
            Stories
          </button>
        </div>

        <div className="section__content">
          {activeSection === 'comics' && <Comics comics={comics} />}
          {activeSection === 'series' && <Series series={series} />}
          {activeSection === 'stories' && <Stories stories={stories} />}
        </div>
      </div>
    </Layout>
  );
};

export default WikiDetails;
