import { Link } from 'react-router';
import '../assets/styles/CharacterCard.css';

const CharacterCard = ({ character, updateBackground, clearBackground }) => (
  <div
    className="character__card"
    onMouseEnter={() => updateBackground(character.images.lg)}
    onMouseLeave={clearBackground}
  >
    <img src={character.images.md} alt={character.name} loading="lazy" />
    <h3>{character.name}</h3>
    <Link to={`/wiki/${character.slug}`}>Details</Link>
  </div>
);

export default CharacterCard;
