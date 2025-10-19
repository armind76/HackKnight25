import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeComponent = () => {
  // State to hold all user data fetched from the JSON file
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch data from the JSON file when the component mounts
    const fetchData = async () => {
      try {
        // This path now correctly points to your plan.json file
        const response = await fetch('/plan.json'); 
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, []); // The empty array ensures this effect runs only once

  // Display a loading message until the data is fetched
  if (!userData) {
    return <div className="text-center text-gray-300 p-10">Loading your dashboard...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 text-gray-100">
      
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          Hello, <span className="text-indigo-400">{userData.username}</span>!
        </h1>
        <p className="text-lg text-gray-300">Ready to tackle your goals for today?</p>
      </div>

      {/* Main content grid for stats and last plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        
        {/* Your Last Plan Card */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-200 border-b border-slate-600 pb-3">Your Last Plan</h2>
          <div className="space-y-4 text-gray-300 pt-3">
            <p><strong className="font-medium text-gray-100 w-24 inline-block">Workout:</strong> {userData.lastPlan.workout}</p>
            <p><strong className="font-medium text-gray-100 w-24 inline-block">Meal Plan:</strong> {userData.lastPlan.mealPlan}</p>
            <p className="text-sm text-gray-400 mt-4">Generated on: {userData.lastPlan.generatedOn}</p>
          </div>
        </div>

        {/* Your Stats Card */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold mb-4 text-gray-200 border-b border-slate-600 pb-3">Your Stats</h2>
          <div className="space-y-4 text-gray-300 pt-3">
            <p><strong className="font-medium text-gray-100 w-32 inline-block">Current Weight:</strong> {userData.currentWeight}</p>
            <p><strong className="font-medium text-gray-100 w-32 inline-block">Height:</strong> {userData.height}</p>
            <p><strong className="font-medium text-gray-100 w-32 inline-block">Goal Weight:</strong> {userData.goalWeight}</p>
          </div>
        </div>

      </div>

      {/* Call to Action Button */}
      <div className="text-center">
        <Link 
          to="/" 
          className="inline-block bg-indigo-600 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg"
        >
	Generate New Plan
        </Link>
      </div>
    </div>
  );
};

export default HomeComponent;
