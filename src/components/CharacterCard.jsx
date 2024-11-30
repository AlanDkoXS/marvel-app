import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/CharacterCard.css';

const CharacterCard = ({ character, updateBackground, clearBackground }) => {
  const handleMouseEnter = () => {
    const imageUrl = `${character.thumbnail.path}.${character.thumbnail.extension}`;
    updateBackground(imageUrl);
  };

  const handleMouseLeave = () => {
    clearBackground();
  };

  return (
    <div
      className="character__card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
        alt={character.name}
      />
      <h3>{character.name}</h3>
      <Link to={`/wiki/${character.name}`}>Details</Link>
    </div>
  );
};

export default CharacterCard;
