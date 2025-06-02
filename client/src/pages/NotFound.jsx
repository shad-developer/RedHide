import React from 'react';
import { Link } from 'react-router-dom'; 
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 selection:bg-yellow-300 selection:text-yellow-900">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full">
        <div className="mb-8">
     
          {/* Option 2: Image
          <img
            src={confusedCowImage} // or "/assets/your-image.png"
            alt="Confused Cow - Page Not Found"
            className="w-40 h-40 sm:w-48 sm:h-48 mx-auto object-contain"
          /> */}
        </div>

        <h1 className="text-4xl font-bold text-red-700 mb-4">
          404 Page Not Found
        </h1>
        <p className="text-md sm:text-lg text-gray-600 mb-8">
          Oops! It seems this page has gone out to pasture.
          <br />
          Don't worry, we'll help you find your way back to the farm.
        </p>

        <Link
          to="/dashboard" 
          className="inline-block px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md"
        >
          Back to the Farm (Home)
        </Link>

        <p className="mt-10 text-sm text-gray-500">
          If you think this is a mistake, please let the farmhands know!
        </p>
      </div>

      {/* Optional: Subtle background elements like faint grass or sky */}
      {/* <div className="absolute bottom-0 left-0 w-full h-20 bg-green-200 opacity-30 z-0"></div> */}
    </div>
  );
};

export default NotFound;