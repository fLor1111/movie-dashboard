import PropTypes from "prop-types";

function SearchBar({
  searchTerm,
  setSearchTerm,
  onSearch,
  loading,
}) {
  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <form
      onSubmit={onSearch}
      className="mx-auto flex w-full max-w-3xl gap-2 px-4 py-6"
      role="search"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search movies or TV series..."
          aria-label="Search movies or TV series"
          className="w-full rounded-lg border border-purple-400/30 bg-gray-900 px-4 py-3 pr-12 text-white placeholder-gray-400 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-xl text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            ×
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !searchTerm.trim()}
        className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

SearchBar.defaultProps = {
  loading: false,
};

export default SearchBar;
