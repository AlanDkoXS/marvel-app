// Controlled search box: results update as you type (see app/Wiki.jsx).
const Search = ({ value, onChange, resultCount }) => (
  <div className="search">
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <input
        type="search"
        placeholder="Search by name, real name or alias"
        aria-label="Search Marvel characters"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      {value && (
        <button type="button" onClick={() => onChange('')}>
          Clear
        </button>
      )}
    </form>
    {resultCount !== null && (
      <p className="search__count" aria-live="polite">
        {resultCount} {resultCount === 1 ? 'character' : 'characters'}
      </p>
    )}
  </div>
);

export default Search;
