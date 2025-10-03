import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Loading from "./components/Loading";
import Footer from "./components/Footer";

const API_URL = "https://www.omdbapi.com/?apikey=66e1d028";

function App() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [moviesPage, setMoviesPage] = useState(1);
  const [seriesPage, setSeriesPage] = useState(1);

  const sortByYearDesc = (arr) => {
    return arr.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  };

  const searchMovies = async (title) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${title}`);
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(sortByYearDesc(data.Search));
        setSeries([]);
        setMoviesPage(1);
        setSeriesPage(1);
      } else {
        setMovies([]);
        setSeries([]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeScreen = async () => {
    setLoading(true);
    try {
      const moviesResponse = await fetch(
        `${API_URL}&s=Avengers&type=movie&page=${moviesPage}`
      );
      const moviesData = await moviesResponse.json();

      const seriesResponse = await fetch(
        `${API_URL}&s=Friends&type=series&page=${seriesPage}`
      );
      const seriesData = await seriesResponse.json();

      setMovies(sortByYearDesc(moviesData.Search || []));
      setSeries(sortByYearDesc(seriesData.Search || []));
    } catch (error) {
      console.error("Error fetching home screen:", error);
      setMovies([]);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeScreen();
  }, []);

  const goHome = async () => {
    setSearchTerm("");
    setMoviesPage(1);
    setSeriesPage(1);
    await fetchHomeScreen();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      searchMovies(searchTerm);
    }
  };

  const loadMoreMovies = async () => {
    setLoading(true);
    try {
      const nextPage = moviesPage + 1;
      const response = await fetch(
        `${API_URL}&s=Avengers&type=movie&page=${nextPage}`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setMovies(sortByYearDesc([...movies, ...data.Search]));
        setMoviesPage(nextPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreSeries = async () => {
    setLoading(true);
    try {
      const nextPage = seriesPage + 1;
      const response = await fetch(
        `${API_URL}&s=Friends&type=series&page=${nextPage}`
      );
      const data = await response.json();
      if (data.Response === "True") {
        setSeries(sortByYearDesc([...series, ...data.Search]));
        setSeriesPage(nextPage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-900 text-white relative">
      <Navbar onHomeClick={goHome} />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSubmit}
      />

      <main className="p-6 mb-20">
        {loading ? (
          <Loading />
        ) : (
          <>
            <MovieList title="Movies" movies={movies} />
            {movies.length > 0 && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={loadMoreMovies}
                  className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-800 font-semibold text-black"
                >
                  Load More Movies
                </button>
              </div>
            )}

            <MovieList title="TV Series" movies={series} />
            {series.length > 0 && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={loadMoreSeries}
                  className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-800 font-semibold text-black"
                >
                  Load More Series
                </button>
              </div>
            )}

            {movies.length === 0 && series.length === 0 && (
              <p className="text-center text-black mt-6">No movies found.</p>
            )}
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-center text-white p-4">
        <p className="text-sm">
          © 2025 Movie Dashboard. Data provided by{" "}
          <a
            href="https://www.imdb.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-purple-900"
          >
            IMDb
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
