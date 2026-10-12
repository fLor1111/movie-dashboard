
import { useRef } from "react";
import PropTypes from "prop-types";
import MovieCard from "./MovieCard";

function MovieCarousel({
  title,
  movies,
  onMovieClick,
  watchlist,
  onToggleWatchlist,
}) {
  const carouselRef = useRef(null);

  if (!movies || movies.length === 0) {
    return null;
  }

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;

    const scrollAmount = carouselRef.current.clientWidth * 0.8;

    carouselRef.current.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white sm:text-2xl">
          {title}
        </h2>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            aria-label={`Scroll ${title} left`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gray-800 text-lg text-white transition hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            aria-label={`Scroll ${title} right`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gray-800 text-lg text-white transition hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {movies.map((movie) => {
          const isWatchlisted = watchlist.some(
            (item) =>
              item.id === movie.id &&
              item.MediaType === movie.MediaType
          );

          return (
            <div
              key={`${movie.MediaType}-${movie.id}`}
              className="w-40 shrink-0 snap-start sm:w-48 md:w-52"
            >
              <MovieCard
                movie={movie}
                onClick={() => onMovieClick(movie)}
                isWatchlisted={isWatchlisted}
                onToggleWatchlist={onToggleWatchlist}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

MovieCarousel.propTypes = {
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

export default MovieCarousel;
