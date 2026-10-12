
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getTitleDetails } from "../tmdb";

function TitleDetailsModal({ movie, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      setDetails(null);
      setLoading(true);
      setError("");

      try {
        const data = await getTitleDetails(
          movie.id,
          movie.MediaType
        );

        if (!cancelled) {
          setDetails(data);
        }
      } catch (err) {
        console.error("Error loading title details:", err);

        if (!cancelled) {
          setError("Couldn't load the details. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [movie.id, movie.MediaType]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Prevent the page behind the modal from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const releaseDate = details
    ? movie.MediaType === "tv"
      ? details.first_air_date
      : details.release_date
    : "";

  const formattedDate = releaseDate
    ? new Date(`${releaseDate}T12:00:00`).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Not available";

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="title-details-heading"
        className="modal-panel relative my-auto max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#11111b] text-white shadow-2xl shadow-black/50"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-2xl text-white backdrop-blur-md transition duration-200 hover:rotate-90 hover:border-purple-400/50 hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          ×
        </button>

        {loading && (
          <div className="grid min-h-[360px] grid-cols-1 sm:grid-cols-[220px_1fr]">
            <div className="aspect-[2/3] animate-pulse bg-gradient-to-br from-gray-800 via-gray-700/60 to-gray-800 sm:aspect-auto" />

            <div
              className="flex flex-col justify-center gap-5 p-6 sm:p-8"
              role="status"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-purple-400/20" />
              <div className="h-8 w-4/5 animate-pulse rounded-lg bg-white/10" />

              <div className="flex gap-3">
                <div className="h-4 w-24 animate-pulse rounded bg-white/[0.07]" />
                <div className="h-4 w-16 animate-pulse rounded bg-white/[0.07]" />
              </div>

              <div className="flex gap-2">
                <div className="h-7 w-16 animate-pulse rounded-full bg-purple-500/20" />
                <div className="h-7 w-20 animate-pulse rounded-full bg-purple-500/20" />
                <div className="h-7 w-16 animate-pulse rounded-full bg-purple-500/20" />
              </div>

              <div className="mt-2 space-y-3">
                <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/[0.07]" />
                <div className="h-4 w-full animate-pulse rounded bg-white/[0.07]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.07]" />
              </div>

              <span className="sr-only">Loading title details...</span>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 text-4xl" aria-hidden="true">
              🎬
            </span>

            <p role="alert" className="text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-lg bg-purple-700 px-5 py-2.5 font-semibold transition hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              Close
            </button>
          </div>
        )}

        {details && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr]">
            <div className="relative bg-gray-900 sm:min-h-full">
              {movie.Poster ? (
                <img
                  src={movie.Poster}
                  alt={`${movie.Title} poster`}
                  className="max-h-[300px] w-full object-cover sm:sticky sm:top-0 sm:max-h-[92vh] sm:min-h-full"
                />
              ) : (
                <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-gray-800 to-[#15151f] p-6 text-center text-gray-400 sm:min-h-[420px]">
                  <div>
                    <span className="mb-3 block text-4xl" aria-hidden="true">
                      🎬
                    </span>
                    No poster available
                  </div>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 sm:bg-gradient-to-r sm:from-transparent sm:to-[#11111b]/30" />
            </div>

            <div className="p-5 sm:p-8 md:p-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-purple-300 sm:text-sm">
                {movie.MediaType === "tv" ? "TV Series" : "Movie"}
              </p>

              <h2
                id="title-details-heading"
                className="mb-4 pr-8 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl"
              >
                {details.title || details.name || movie.Title}
              </h2>

              <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-300">
                <span>{formattedDate}</span>
                <span className="text-gray-600" aria-hidden="true">•</span>

                <span className="inline-flex items-center gap-1 font-semibold text-yellow-400">
                  <span aria-hidden="true">★</span>
                  {Number(details.vote_average ?? 0).toFixed(1)}
                  <span className="font-normal text-gray-400">/10</span>
                </span>

                <span className="text-gray-600" aria-hidden="true">•</span>

                <span>
                  {Number(details.vote_count ?? 0).toLocaleString()} votes
                </span>
              </div>

              <div className="mb-7 flex flex-wrap gap-2">
                {details.genres?.length > 0 ? (
                  details.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-200"
                    >
                      {genre.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">
                    Genres unavailable
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                  <span className="h-5 w-1 rounded-full bg-purple-400" />
                  Overview
                </h3>

                <p className="whitespace-pre-line text-sm leading-7 text-gray-300 sm:text-base">
                  {details.overview || "No overview is available for this title."}
                </p>
              </div>

              {movie.MediaType === "movie" && details.runtime > 0 && (
                <div className="mb-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">Runtime:</span>{" "}
                    {details.runtime} minutes
                  </p>
                </div>
              )}

              {movie.MediaType === "tv" && (
                <div className="mb-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-white">Seasons:</span>{" "}
                    {details.number_of_seasons ?? "N/A"}
                    <span className="mx-3 text-gray-600">|</span>
                    <span className="font-semibold text-white">Episodes:</span>{" "}
                    {details.number_of_episodes ?? "N/A"}
                  </p>
                </div>
              )}

              {details.status && (
                <p className="mt-4 text-sm text-gray-400">
                  Status: <span className="text-gray-300">{details.status}</span>
                </p>
              )}

              <a
                href={
                  movie.MediaType === "tv"
                    ? `https://www.themoviedb.org/tv/${movie.id}`
                    : `https://www.themoviedb.org/movie/${movie.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl border border-purple-400/20 bg-purple-600 px-5 py-3 font-semibold text-white shadow-lg shadow-purple-950/30 transition duration-200 hover:-translate-y-0.5 hover:bg-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
              >
                View on TMDB
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

TitleDetailsModal.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    Title: PropTypes.string.isRequired,
    Poster: PropTypes.string,
    MediaType: PropTypes.oneOf(["movie", "tv"]).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TitleDetailsModal;
