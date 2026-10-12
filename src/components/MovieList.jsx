
import PropTypes from "prop-types";
import MovieCard from "./MovieCard";

function MovieList({
  title,
  movies,
  onMovieClick,
  watchlist,
  onToggleWatchlist,
}) {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {movies.map((movie) => {
          const isWatchlisted = watchlist.some(
            (item) =>
              item.id === movie.id &&
              item.MediaType === movie.MediaType
          );

          return (
            <MovieCard
              key={`${movie.MediaType}-${movie.id}`}
              movie={movie}
              onClick={() => onMovieClick(movie)}
              isWatchlisted={isWatchlisted}
              onToggleWatchlist={onToggleWatchlist}
            />
          );
        })}
      </div>
    </section>
  );
}

MovieList.propTypes = {
  title: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      Title: PropTypes.string.isRequired,
      Year: PropTypes.string.isRequired,
      Poster: PropTypes.string,
      Rating: PropTypes.number.isRequired,
      VoteCount: PropTypes.number.isRequired,
      MediaType: PropTypes.oneOf(["movie", "tv"]).isRequired,
    })
  ).isRequired,
  onMovieClick: PropTypes.func.isRequired,
  watchlist: PropTypes.array.isRequired,
  onToggleWatchlist: PropTypes.func.isRequired,
};

export default MovieList;
