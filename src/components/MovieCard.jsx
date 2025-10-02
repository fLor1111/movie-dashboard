import React from "react";
import PropTypes from "prop-types";

function MovieCard({ movie }) {
  const openMovie = () => {
    window.open(`https://www.imdb.com/title/${movie.imdbID}`, "_blank");
  };

  return (
    <div
      role="button"
      tabIndex="0"
      className="bg-black p-4 rounded-lg cursor-pointer hover:scale-105 hover:shadow-lg transition-transform duration-300"
      onClick={openMovie}
      onKeyPress={(e) => {
        if (e.key === "Enter") openMovie();
      }}
    >
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200"}
        alt={movie.Title}
        className="w-full h-72 object-cover rounded"
      />
      <h2 className="text-lg font-semibold mt-2">{movie.Title}</h2>
      <p className="text-sm text-gray-300">{movie.Year}</p>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    imdbID: PropTypes.string.isRequired,
    Poster: PropTypes.string,
    Title: PropTypes.string.isRequired,
    Year: PropTypes.string,
  }).isRequired,
};

MovieCard.defaultProps = {
  movie: {
    Poster: "https://via.placeholder.com/200",
    Year: "N/A",
  },
};

export default MovieCard;
