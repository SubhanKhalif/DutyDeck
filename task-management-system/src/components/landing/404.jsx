import React from "react";
import FuzzyText from "./40";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black flex flex-col items-center justify-center">
      <div className="text-center">
        <FuzzyText fontSize="clamp(4rem, 20vw, 20rem)" color="#ffffff">
          404
        </FuzzyText>
        <p className="text-2xl text-gray-200 mt-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-black hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-2xl shadow-xl transition text-lg tracking-wide"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;