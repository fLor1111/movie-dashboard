
import PropTypes from "prop-types";

function FeaturedMovie({ movie, onMovieClick }) {
  if (!movie) {
    return null;
  }

  const description = movie.Overview?.trim();

  return (
    <section className="mx-auto mb-12 max-w-[1440px]">
      <div className="group relative isolate min-h-[480px] overflow-hidden rounded-2xl border border-white/10 bg-[#11111a] shadow-2xl shadow-black/30 sm:min-h-[520px] lg:min-h-[560px]">
        {movie.Backdrop ? (
          <img
            src={movie.Backdrop}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 -z-20 bg-gradient-to-br from-purple-950 via-[#171321] to-[#09090d]" />
        )}

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#09090d] via-[#09090d]/90 to-[#09090d]/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#09090d] via-transparent to-black/20" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-purple-950/35 via-transparent to-transparent" />

        <div className="flex min-h-[480px] items-end px-6 py-10 sm:min-h-[520px] sm:px-10 sm:py-12 lg:min-h-[560px] lg:items-center lg:px-16">
          <div className="max-w-2xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-purple-200 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.9)]" />
                Featured pick
              </span>

              <span className="text-sm font-medium text-gray-300">
                {movie.MediaType === "tv" ? "TV Series" : "Movie"}
              </span>

              <span className="text-gray-600">•</span>

              <span className="text-sm text-gray-300">
                {movie.Year}
              </span>
            </div>

            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl xl:text-7xl">
              {movie.Title}
            </h1>

            <p className="mb-7 max-w-xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              {description ||
                "Discover more about this title, explore its details, and see whether it belongs on your watchlist."}
            </p>

            <div className="mb-8 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 backdrop-blur-md">
                <span className="text-xl text-yellow-400" aria-hidden="true">
                  ★
                </span>

                <div>
                  <p className="text-sm font-bold text-white">
                    {movie.Rating.toFixed(1)}
                    <span className="ml-1 font-normal text-gray-400">
                      / 10
                    </span>
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-gray-400">
                    TMDB rating
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onMovieClick(movie)}
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-purple-500 hover:shadow-xl hover:shadow-purple-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 sm:px-8 sm:py-4 sm:text-base"
            >
              View Details
              <span
                className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
      </div>
    </section>
  );
}

FeaturedMovie.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    Title: PropTypes.string.isRequired,
    Year: PropTypes.string.isRequired,
    Overview: PropTypes.string,
    Backdrop: PropTypes.string,
    Rating: PropTypes.number.isRequired,
    MediaType: PropTypes.oneOf(["movie", "tv"]).isRequired,
  }),
  onMovieClick: PropTypes.func.isRequired,
};

export default FeaturedMovie;