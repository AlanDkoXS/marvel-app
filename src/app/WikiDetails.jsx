import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCharacterDetails, fetchComics } from '../hooks/useFetch';
import { useAudio } from '../context/AudioContext';
import Layout from '../components/Layout';
import '../assets/styles/WikiDetails.css';

const WikiDetails = () => {
  const { name } = useParams();
  const { isAudioPlaying, startAudio } = useAudio();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message || 'Error loading details');
      } finally {
        setLoading(false);
      }
    };

    loadCharacterData();
  }, [name]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <div className="wiki__details">
        <div className='comic__container'>
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
        <div>
          <h2>Comics:</h2>
          {comics.length > 0 ? (
            <div className="comics">
              {comics.map((comic) => (
                <div key={comic.id} className="comic">
                  <img
                    src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                    alt={comic.title}
                  />
                  <p>{comic.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No comics available</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WikiDetails;
