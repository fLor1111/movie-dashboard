import React from "react";
import PropTypes from "prop-types";
import logo from "../assets/logo.png";

function Navbar({ onHomeClick }) {
  return (
    <nav className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded shadow-md">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Movie Review Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold text-purple-400">Movie Review</h1>
      </div>

      <button
        onClick={onHomeClick}
        className="bg-purple-700 px-6 py-2 rounded hover:bg-purple-600 text-black font-semibold transition-colors"
      >
        Home
      </button>
    </nav>
  );
}

Navbar.propTypes = {
  onHomeClick: PropTypes.func.isRequired,
};

export default Navbar;
