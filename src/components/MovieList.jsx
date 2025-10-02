import React from "react";
import PropTypes from "prop-types";
import MovieCard from "./MovieCard";

function MovieList({ title, movies }) {
  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </section>
  );
}

MovieList.propTypes = {
  title: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbID: PropTypes.string.isRequired,
      Poster: PropTypes.string,
      Title: PropTypes.string.isRequired,
      Year: PropTypes.string,
    })
  ).isRequired,
};

MovieList.defaultProps = {
  movies: [],
};

export default MovieList;
