// Lowercases, strips accents and drops everything but letters and digits,
// so "spiderman", "Spider Man" and "spider-man" all match "Spider-Man".
export const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');

// Ranks matches: name starts with the term, then name contains it, then the
// real name or an alias contains it. Ties keep the input (alphabetical) order.
export const searchCharacters = (characters, term) => {
  const query = normalize(term);
  if (!query) return characters;

  const ranked = [];
  characters.forEach((character, index) => {
    let rank = null;
    if (character.searchName.startsWith(query)) rank = 0;
    else if (character.searchName.includes(query)) rank = 1;
    else if (character.searchOther.some((text) => text.includes(query)))
      rank = 2;

    if (rank !== null) ranked.push({ character, rank, index });
  });

  return ranked
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ character }) => character);
};
