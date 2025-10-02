import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-12 rounded-t-lg shadow-inner">
      <p className="text-sm">
        Powered by <a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400">OMDB API</a> | Movie Dashboard © 2025
      </p>
    </footer>
  );
}

export default Footer;
