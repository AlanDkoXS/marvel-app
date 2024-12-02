import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCharacterDetails, fetchComics } from '../hooks/useFetch';

const WikiDetails = () => {
  const { name } = useParams();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="wiki-details">
      <Link to="/wiki" className="back-button">
        Back
      </Link>
      <div className="character-info">
        <h1>{character.name}</h1>
        <p>{character.description || 'No description available'}</p>
        {character.thumbnail ? (
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="character-image"
          />
        ) : (
          <p>No image available</p>
        )}
      </div>
      <div className="comics-info">
        <h2>Comics:</h2>
        {comics.length > 0 ? (
          <div className="comics-list">
            {comics.map((comic) => (
              <div key={comic.id} className="comic-card">
                <img
                  src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                  alt={comic.title}
                  className="comic-thumbnail"
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
