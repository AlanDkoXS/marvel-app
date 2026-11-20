import { useEffect, useState } from 'react';
import { normalize } from '../utils/search';

// The Marvel developer API (gateway.marvel.com) was retired in late 2025.
// Data now comes from the open SuperHero API dataset, pinned to a release
// and served by jsDelivr (CORS-enabled, no API key).
const DATASET_URL =
  'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json';

// The dataset uses '-', '' or null for unknown values.
const clean = (value) =>
  value === null || value === undefined || value === '-' || value === ''
    ? null
    : value;

const toCharacter = (hero) => {
  const aliases = (hero.biography.aliases || []).filter(
    (alias) => clean(alias) && alias !== hero.name,
  );
  const fullName = clean(hero.biography.fullName);

  return {
    id: hero.id,
    slug: hero.slug,
    name: hero.name,
    fullName: fullName === hero.name ? null : fullName,
    aliases,
    images: hero.images,
    powerstats: hero.powerstats,
    biography: hero.biography,
    appearance: hero.appearance,
    work: hero.work,
    connections: hero.connections,
    // Precomputed for search: see utils/search.js.
    searchName: normalize(hero.name),
    searchOther: [fullName, ...aliases].filter(Boolean).map(normalize),
  };
};

let charactersPromise = null;

// Downloads the dataset once per page load and keeps only Marvel characters,
// sorted by name. A failed download is not cached, so it can be retried.
export const loadCharacters = () => {
  if (!charactersPromise) {
    charactersPromise = fetch(DATASET_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load characters (HTTP ${response.status})`);
        }
        return response.json();
      })
      .then((heroes) =>
        heroes
          .filter((hero) => hero.biography.publisher === 'Marvel Comics')
          .map(toCharacter)
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
      .catch((error) => {
        charactersPromise = null;
        throw error;
      });
  }
  return charactersPromise;
};

const useCharacters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    loadCharacters()
      .then((result) => {
        if (!ignore) {
          setCharacters(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Could not load characters');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  const retry = () => {
    setLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  };

  return { characters, loading, error, retry };
};

export default useCharacters;
