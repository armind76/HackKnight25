import React from 'react';
import { Link } from 'react-router-dom';

const HomeComponent = () => {
  // Placeholder username. This will eventually come from user authentication.
  const username = "Armin";

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 text-gray-100">
      
      {/* Welcome Header */}
      <h1 className="text-4xl font-bold mb-4">
        Hello, <span className="text-indigo-400">{username}</span>!
      </h1>
      <p className="text-lg text-gray-300 mb-10">Ready to tackle your goals for today?</p>

      {/* Previous Plan Section Card */}
      <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-10 border border-slate-700">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">Your Last Plan</h2>
        <div className="space-y-3 text-gray-300">
          <p><strong className="font-medium text-gray-100">Workout:</strong> Full Body Strength Training</p>
          <p><strong className="font-medium text-gray-100">Meal Plan:</strong> High Protein Diet - 2200 kcal</p>
          <p className="text-sm text-gray-400 mt-4">Generated on: October 17, 2025</p>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="text-center">
        <Link 
          to="/generator" 
          className="inline-block bg-indigo-600 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
        >
          Create a New Plan
        </Link>
      </div>
    </div>
  );
};

export default HomeComponent;

