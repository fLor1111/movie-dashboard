function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-6 mt-12 rounded-t-lg shadow-inner">
      <p className="text-sm">
        Movie Dashboard © 2026
      </p>

      <p className="text-xs text-gray-300 mt-2">
        This product uses the{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-purple-400"
        >
          TMDB API
        </a>{" "}
        but is not endorsed or certified by TMDB.
      </p>
    </footer>
  );
}

export default Footer;
