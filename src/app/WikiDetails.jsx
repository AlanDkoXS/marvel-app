import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import {
  fetchCharacterDetails,
  fetchComics,
  fetchSeries,
  fetchStories,
} from '../hooks/useFetch';
import { useAudio } from '../context/AudioContext';
import Layout from '../components/Layout';
import { useBackground } from '../context/BackgroundContext';
import Comics from '../components/Comics';
import Series from '../components/Series';
import Stories from '../components/Stories';
import '../assets/styles/WikiDetails.css';

const WikiDetails = () => {
  const { name } = useParams();
  const { startAudio } = useAudio();
  const { backgroundImage } = useBackground();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [series, setSeries] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('comics');

  useEffect(() => {
    startAudio();
  }, [startAudio]);

  useEffect(() => {
    let ignore = false;

    const loadCharacterData = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedCharacter = await fetchCharacterDetails(name);
        // Three requests in total: one per collection, not one per item.
        const [fetchedComics, fetchedSeries, fetchedStories] =
          await Promise.all([
            fetchComics(fetchedCharacter.id),
            fetchSeries(fetchedCharacter.id),
            fetchStories(fetchedCharacter.id),
          ]);

        if (!ignore) {
          setCharacter(fetchedCharacter);
          setComics(fetchedComics);
          setSeries(fetchedSeries);
          setStories(fetchedStories);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Error loading details');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCharacterData();
    return () => {
      ignore = true;
    };
  }, [name]);

  if (loading) return <h2>Loading...</h2>;
  if (error)
    return (
      <Layout backgroundImage={backgroundImage}>
        <p>{error}</p>
        <Link to="/wiki">Back</Link>
      </Layout>
    );

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
          <p>{character.description}</p>
        </div>
        <Link to="/wiki">Back</Link>

        <div className="section__buttons">
          <button onClick={() => setActiveSection('comics')}>Comics</button>
          <button onClick={() => setActiveSection('series')}>Series</button>
          <button onClick={() => setActiveSection('stories')}>Stories</button>
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
