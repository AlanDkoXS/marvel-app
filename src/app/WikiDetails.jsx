import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  fetchCharacterDetails,
  fetchComicDetails,
} from '../services/marvelService';

const WikiDetails = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comicsLoading, setComicsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comicsError, setComicsError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCharacter = await fetchCharacterDetails(id);
        setCharacter(fetchedCharacter);
      } catch (err) {
        setError(err.message || 'Failed to fetch character details');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  useEffect(() => {
    const fetchComics = async () => {
      if (!character) return;

      setComicsLoading(true);
      setComicsError(null);

      try {
        const comicsData = await Promise.all(
          character.comics.items.map((comic) =>
            fetchComicDetails(comic.resourceURI),
          ),
        );
        setComics(comicsData);
      } catch (err) {
        setComicsError(err.message || 'Failed to fetch comics');
      } finally {
        setComicsLoading(false);
      }
    };

    fetchComics();
  }, [character]);

  if (loading || comicsLoading) return <p>Loading...</p>;
  if (error || comicsError) return <p>{error || comicsError}</p>;

  return (
    <div className="wiki-details">
      <Link to="/wiki" className="back-button">
        ← Back to Wiki
      </Link>
      <div className="character-info">
        <h1>{character.name}</h1>
        <p>{character.description || 'No description available'}</p>
        <img
          src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
          alt={character.name}
          className="character-image"
        />
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
