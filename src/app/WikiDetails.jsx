import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCharacterDetails, fetchComics } from '../hooks/useFetch';
import { useAudio } from '../context/AudioContext';

const WikiDetails = () => {
  const { name } = useParams();
  const { isAudioPlaying, startAudio } = useAudio();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mantén el audio si no está reproduciéndose
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
    <div>
      <Link to="/wiki">Back</Link>
      <div>
        <h1>{character.name}</h1>
        <p>{character.description || 'No description available'}</p>
        {character.thumbnail ? (
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
          />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <div>
        <h2>Comics:</h2>
        {comics.length > 0 ? (
          <div>
            {comics.map((comic) => (
              <div key={comic.id}>
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
  );
};

export default WikiDetails;
