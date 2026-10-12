
import { useState, useEffect, useCallback } from "react";

import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import MovieCarousel from "./components/MovieCarousel";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import FeaturedMovie from "./components/FeaturedMovie";
import TitleDetailsModal from "./components/TitleDetailsModal";

import {
  discoverTitles,
  searchTitles,
  sortTitles,
  fetchTrendingTitles,
  fetchPopularTitles,
} from "./tmdb";

const WATCHLIST_STORAGE_KEY = "movie-dashboard-watchlist";

function App() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(null);
  const [error, setError] = useState("");

  const [moviesPage, setMoviesPage] = useState(1);
  const [seriesPage, setSeriesPage] = useState(1);

  const [moviesTotalPages, setMoviesTotalPages] = useState(1);
  const [seriesTotalPages, setSeriesTotalPages] = useState(1);

  const [selectedTitle, setSelectedTitle] = useState(null);

  // Load saved titles from the browser.
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = window.localStorage.getItem(
        WATCHLIST_STORAGE_KEY
      );

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Couldn't read the saved watchlist:", err);
      return [];
    }
  });

  // Save the watchlist whenever it changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        WATCHLIST_STORAGE_KEY,
        JSON.stringify(watchlist)
      );
    } catch (err) {
      console.error("Couldn't save the watchlist:", err);
    }
  }, [watchlist]);

  // Add or remove a movie or TV series.
  const toggleWatchlist = useCallback((title) => {
    setWatchlist((previous) => {
      const alreadySaved = previous.some(
        (item) =>
          item.id === title.id &&
          item.MediaType === title.MediaType
      );

      if (alreadySaved) {
        return previous.filter(
          (item) =>
            !(
              item.id === title.id &&
              item.MediaType === title.MediaType
            )
        );
      }

      return [title, ...previous];
    });
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedTitle(null);
  }, []);

  const fetchHomeScreen = useCallback(async () => {
    setLoading(true);
    setLoadingMore(null);
    setError("");

    try {
      const [
        movieData,
        seriesData,
        trendingData,
        popularMovieData,
        popularSeriesData,
      ] = await Promise.all([
        discoverTitles("movie", 1),
        discoverTitles("tv", 1),
        fetchTrendingTitles(1),
        fetchPopularTitles("movie", 1),
        fetchPopularTitles("tv", 1),
      ]);

      setMovies(sortTitles(movieData.results));
      setSeries(sortTitles(seriesData.results));

      setTrending(trendingData.results);
      setPopularMovies(popularMovieData.results);
      setPopularSeries(popularSeriesData.results);

      setMoviesPage(1);
      setSeriesPage(1);

      setMoviesTotalPages(movieData.totalPages);
      setSeriesTotalPages(seriesData.totalPages);
    } catch (err) {
      console.error("Error fetching TMDB home screen:", err);

      setError(
        "We couldn't load the homepage. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeScreen();
  }, [fetchHomeScreen]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      setError("Please enter a movie or TV series title to search.");
      return;
    }

    setLoading(true);
    setLoadingMore(null);
    setError("");
    setActiveSearch(query);

    setMovies([]);
    setSeries([]);

    setMoviesPage(1);
    setSeriesPage(1);

    try {
      const [movieData, seriesData] = await Promise.all([
        searchTitles(query, "movie", 1),
        searchTitles(query, "tv", 1),
      ]);

      setMovies(sortTitles(movieData.results));
      setSeries(sortTitles(seriesData.results));

      setMoviesTotalPages(movieData.totalPages);
      setSeriesTotalPages(seriesData.totalPages);
    } catch (err) {
      console.error("Error searching TMDB:", err);

      setMovies([]);
      setSeries([]);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    setSearchTerm("");
    setActiveSearch("");
    setError("");

    setMovies([]);
    setSeries([]);

    setMoviesPage(1);
    setSeriesPage(1);

    fetchHomeScreen();
  };

  const loadMore = async (type) => {
    if (loading || loadingMore) {
      return;
    }

    const isMovie = type === "movie";

    const currentPage = isMovie ? moviesPage : seriesPage;
    const totalPages = isMovie
      ? moviesTotalPages
      : seriesTotalPages;

    if (currentPage >= totalPages) {
      return;
    }

    const nextPage = currentPage + 1;

    setLoadingMore(type);
    setError("");

    try {
      const data = activeSearch
        ? await searchTitles(activeSearch, type, nextPage)
        : await discoverTitles(type, nextPage);

      if (isMovie) {
        setMovies((previous) =>
          sortTitles([...previous, ...data.results])
        );

        setMoviesPage(nextPage);
        setMoviesTotalPages(data.totalPages);
      } else {
        setSeries((previous) =>
          sortTitles([...previous, ...data.results])
        );

        setSeriesPage(nextPage);
        setSeriesTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Error loading more titles:", err);
      setError("Couldn't load more titles. Please try again.");
    } finally {
      setLoadingMore(null);
    }
  };

  const isHomePage = !activeSearch;

  const featuredMovie =
    movies.find((movie) => movie.Backdrop) || movies[0];

  return (
    <div className="min-h-screen bg-purple-900 text-white">
      <Navbar onHomeClick={goHome} />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSubmit}
        loading={loading}
      />

      <main className="p-4 pb-10 sm:p-6">
        {error && (
          <p
            role="alert"
            className="mb-4 text-center text-red-300"
          >
            {error}
          </p>
        )}

        {loading && movies.length === 0 && series.length === 0 ? (
          <Loading />
        ) : (
          <>
            {isHomePage && featuredMovie && (
              <FeaturedMovie
                movie={featuredMovie}
                onMovieClick={setSelectedTitle}
              />
            )}

            {isHomePage && (
              <>
                <MovieCarousel
                  title="🔥 Trending This Week"
                  movies={trending}
                  onMovieClick={setSelectedTitle}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                />

                <MovieCarousel
                  title="⭐ Popular Movies"
                  movies={popularMovies}
                  onMovieClick={setSelectedTitle}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                />

                <MovieCarousel
                  title="📺 Popular TV Series"
                  movies={popularSeries}
                  onMovieClick={setSelectedTitle}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                />

                {/* Watchlist section */}
                <section className="mb-10">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold text-white">
                      ❤️ My Watchlist
                    </h2>

                    <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-sm text-purple-200">
                      {watchlist.length}{" "}
                      {watchlist.length === 1 ? "title" : "titles"}
                    </span>
                  </div>

                  {watchlist.length > 0 ? (
                    <MovieList
                      title="Saved for later"
                      movies={watchlist}
                      onMovieClick={setSelectedTitle}
                      watchlist={watchlist}
                      onToggleWatchlist={toggleWatchlist}
                    />
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/15 bg-[#15151f]/70 px-5 py-10 text-center">
                      <span className="mb-3 block text-4xl text-purple-300">
                        ♡
                      </span>

                      <h3 className="mb-2 text-lg font-semibold text-white">
                        Your watchlist is waiting
                      </h3>

                      <p className="mx-auto max-w-md text-sm leading-6 text-gray-400">
                        Found something you want to watch later?
                        Tap the heart on any movie or TV series to
                        save it here.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}

            <MovieList
              title={
                activeSearch
                  ? `Movies matching "${activeSearch}"`
                  : "Latest Movies"
              }
              movies={movies}
              onMovieClick={setSelectedTitle}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />

            {movies.length > 0 &&
              moviesPage < moviesTotalPages && (
                <div className="mb-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => loadMore("movie")}
                    disabled={loading || loadingMore !== null}
                    className="rounded-lg bg-purple-700 px-5 py-3 font-semibold transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingMore === "movie"
                      ? "Loading Movies..."
                      : "Load More Movies"}
                  </button>
                </div>
              )}

            {loadingMore === "movie" && (
              <p className="mb-6 text-center text-sm text-purple-200">
                Loading more movies...
              </p>
            )}

            <MovieList
              title={
                activeSearch
                  ? `TV Series matching "${activeSearch}"`
                  : "Latest TV Series"
              }
              movies={series}
              onMovieClick={setSelectedTitle}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />

            {series.length > 0 &&
              seriesPage < seriesTotalPages && (
                <div className="mb-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => loadMore("tv")}
                    disabled={loading || loadingMore !== null}
                    className="rounded-lg bg-purple-700 px-5 py-3 font-semibold transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loadingMore === "tv"
                      ? "Loading TV Series..."
                      : "Load More TV Series"}
                  </button>
                </div>
              )}

            {loadingMore === "tv" && (
              <p className="mb-6 text-center text-sm text-purple-200">
                Loading more TV series...
              </p>
            )}
                        
            {!loading &&
              !loadingMore &&
              movies.length === 0 &&
              series.length === 0 &&
              !error && (
                <div className="mx-auto my-12 max-w-xl rounded-2xl border border-dashed border-white/15 bg-[#15151f]/80 px-6 py-12 text-center shadow-xl shadow-black/10 sm:px-10">
                  <div
                    className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10 text-4xl text-purple-300"
                    aria-hidden="true"
                  >
                    {activeSearch ? "🔎" : "🎬"}
                  </div>

                  <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl">
                    {activeSearch ? "No titles found" : "Nothing to show right now"}
                  </h2>

                  <p className="mx-auto max-w-md text-sm leading-6 text-gray-400 sm:text-base">
                    {activeSearch
                      ? `We couldn't find any movies or TV series matching "${activeSearch}". Check the spelling or try a different title.`
                      : "We couldn't find any titles to display. Try returning to the homepage in a moment."}
                  </p>

                  {activeSearch && (
                    <button
                      type="button"
                      onClick={goHome}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                    >
                      <span aria-hidden="true">←</span>
                      Back to homepage
                    </button>
                  )}
                </div>
              )}
          </>
        )}
      </main>

      {selectedTitle && (
        <TitleDetailsModal
          movie={selectedTitle}
          onClose={closeDetails}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
