
import PropTypes from "prop-types";

function MovieCard({
  movie,
  onClick,
  isWatchlisted,
  onToggleWatchlist,
}) {
  return (
    <div className="group relative h-full">
      <button
        type="button"
        onClick={onClick}
        aria-label={`View details for ${movie.Title}`}
        className="block h-full w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#15151f] text-left shadow-lg shadow-black/10 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
          {movie.Poster ? (
            <img
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center bg-gradient-to-br from-gray-800 to-[#15151f] p-4 text-center text-sm text-gray-400">
              <div>
                <span className="mb-2 block text-3xl">🎬</span>
                Poster unavailable
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

          <span className="absolute left-2 top-2 rounded-md border border-white/10 bg-black/65 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:text-xs">
            {movie.MediaType === "tv" ? "TV Series" : "Movie"}
          </span>

          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md border border-yellow-300/20 bg-black/75 px-2 py-1 text-xs font-bold text-yellow-300 backdrop-blur-sm sm:bottom-3 sm:right-3 sm:text-sm">
            <span aria-hidden="true">★</span>
            {movie.Rating.toFixed(1)}
          </span>
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-snug text-gray-100 transition-colors duration-200 group-hover:text-purple-300 sm:text-base">
            {movie.Title}
          </h3>

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-gray-400 sm:text-sm">
              {movie.Year}
            </span>

            <span className="truncate text-right text-[10px] text-gray-500 sm:text-xs">
              {movie.VoteCount.toLocaleString()} votes
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-purple-300 transition-all duration-200 group-hover:gap-2 sm:text-sm">
            View details
            <span aria-hidden="true">→</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onToggleWatchlist(movie)}
        aria-label={
          isWatchlisted
            ? `Remove ${movie.Title} from watchlist`
            : `Add ${movie.Title} to watchlist`
        }
        aria-pressed={isWatchlisted}
        title={
          isWatchlisted
            ? "Remove from watchlist"
            : "Add to watchlist"
        }
        className={`absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 sm:right-3 sm:top-3 ${
          isWatchlisted
            ? "border-pink-400/40 bg-pink-500/20 text-pink-400"
            : "border-white/15 bg-black/65 text-white hover:border-pink-400/40 hover:bg-pink-500/20 hover:text-pink-400"
        }`}
      >
        <span className="text-2xl leading-none" aria-hidden="true">
          {isWatchlisted ? "♥" : "♡"}
        </span>
      </button>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    Title: PropTypes.string.isRequired,
    Year: PropTypes.string.isRequired,
    Poster: PropTypes.string,
    Rating: PropTypes.number.isRequired,
    VoteCount: PropTypes.number.isRequired,
    MediaType: PropTypes.oneOf(["movie", "tv"]).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isWatchlisted: PropTypes.bool.isRequired,
  onToggleWatchlist: PropTypes.func.isRequired,
};

export default MovieCard;
