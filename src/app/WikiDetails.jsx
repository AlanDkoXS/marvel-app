import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import useCharacters from '../hooks/useCharacters';
import { useAudio } from '../context/AudioContext';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import { useBackground } from '../context/BackgroundContext';
import '../assets/styles/WikiDetails.css';

const SECTIONS = ['powerstats', 'biography', 'appearance', 'connections'];

const isKnown = (value) =>
  value !== null && value !== undefined && value !== '-' && value !== '';

// Renders label/value rows, skipping values the dataset marks as unknown.
const DetailList = ({ items }) => {
  const known = items.filter(([, value]) => isKnown(value));
  if (known.length === 0) return <p>No information available</p>;

  return (
    <dl className="details__list">
      {known.map(([label, value]) => (
        <div key={label} className="details__row">
          <dt>{label}</dt>
          <dd>{Array.isArray(value) ? value.join(', ') : value}</dd>
        </div>
      ))}
    </dl>
  );
};

const Powerstats = ({ stats }) => (
  <ul className="powerstats">
    {Object.entries(stats).map(([stat, value]) => (
      <li key={stat} className="powerstats__item">
        <span className="powerstats__label">{stat}</span>
        <span className="powerstats__bar" aria-hidden="true">
          <span style={{ width: `${value}%` }} />
        </span>
        <span className="powerstats__value">{value}</span>
      </li>
    ))}
  </ul>
);

const SectionContent = ({ section, character }) => {
  const { biography, appearance, work, connections } = character;

  switch (section) {
    case 'powerstats':
      return <Powerstats stats={character.powerstats} />;
    case 'biography':
      return (
        <DetailList
          items={[
            ['Real name', character.fullName],
            ['Aliases', character.aliases.length ? character.aliases : null],
            ['Place of birth', biography.placeOfBirth],
            ['First appearance', biography.firstAppearance],
            ['Alignment', biography.alignment],
            ['Occupation', work.occupation],
            ['Base', work.base],
          ]}
        />
      );
    case 'appearance':
      return (
        <DetailList
          items={[
            ['Gender', appearance.gender],
            ['Race', appearance.race],
            ['Height', appearance.height?.filter(isKnown).join(' / ')],
            ['Weight', appearance.weight?.filter(isKnown).join(' / ')],
            ['Eye color', appearance.eyeColor],
            ['Hair color', appearance.hairColor],
          ]}
        />
      );
    case 'connections':
      return (
        <DetailList
          items={[
            ['Group affiliation', connections.groupAffiliation],
            ['Relatives', connections.relatives],
          ]}
        />
      );
    default:
      return null;
  }
};

const WikiDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { startAudio } = useAudio();
  const { backgroundImage } = useBackground();
  const { characters, loading, error, retry } = useCharacters();
  const [activeSection, setActiveSection] = useState('powerstats');

  useEffect(() => {
    startAudio();
  }, [startAudio]);

  const character = characters.find((c) => c.slug === slug);

  // Return to the search results (and their ?q=&page=) when we came from
  // them; otherwise, e.g. on a shared link, go to the plain list.
  const goBack = (event) => {
    if (window.history.state?.idx > 0) {
      event.preventDefault();
      navigate(-1);
    }
  };
  const backLink = (
    <Link to="/wiki" onClick={goBack}>
      Back
    </Link>
  );

  if (loading) return <Loading />;
  if (error || !character)
    return (
      <Layout backgroundImage={backgroundImage}>
        <p>{error ? `Error: ${error}` : 'Character not found'}</p>
        {error && <button onClick={retry}>Try again</button>}
        {backLink}
      </Layout>
    );

  return (
    <Layout backgroundImage={backgroundImage || character.images.lg}>
      <div className="wiki__details">
        <div className="character__container">
          <img
            src={character.images.md}
            alt={character.name}
            className="character__image"
          />
          <h1>{character.name}</h1>
          {character.fullName && <p>{character.fullName}</p>}
        </div>
        {backLink}

        <div className="section__buttons" role="tablist">
          {SECTIONS.map((section) => (
            <button
              key={section}
              role="tab"
              aria-selected={activeSection === section}
              className={activeSection === section ? 'is-active' : undefined}
              onClick={() => setActiveSection(section)}
            >
              {section[0].toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        <div className="section__content" role="tabpanel">
          <SectionContent section={activeSection} character={character} />
        </div>
      </div>
    </Layout>
  );
};

export default WikiDetails;
