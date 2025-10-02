import React from "react";
import PropTypes from "prop-types";

function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <form onSubmit={onSearch} className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 w-64 rounded-l bg-purple-700 border border-purple-800 text-black font-semibold placeholder-black focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="bg-purple-700 px-4 rounded-r hover:bg-purple-800 font-semibold text-black border border-purple-800"
      >
        Search
      </button>
    </form>
  );
}

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
