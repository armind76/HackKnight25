import React, { useState } from 'react';

// Helper component for SVG icons
const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

// Icon paths
const ICONS = {
  dumbbell: "M15.75 3.75a.75.75 0 00-1.5 0v1.5h-1.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5h-1.5v-1.5zM20.25 15a.75.75 0 00-.75.75v.75H18.75a.75.75 0 000 1.5h.75v.75a.75.75 0 001.5 0v-.75h.75a.75.75 0 000-1.5h-.75v-.75a.75.75 0 00-.75-.75zM12 3a.75.75 0 00-.75.75v16.5a.75.75 0 001.5 0V3.75A.75.75 0 0012 3zM3.75 6.75a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0v-1.5h1.5a.75.75 0 000-1.5H6.75v-1.5a.75.75 0 00-1.5 0v1.5H3.75z",
  leaf: "M12.378 1.602a.75.75 0 00-.756 0L3 7.252v4.9a.75.75 0 00.75.75h2.25a.75.75 0 00.75-.75v-2.256a.75.75 0 01.53-.707l6.22-3.11a.75.75 0 000-1.328L3.75 1.75l8.628-.148zM12 1.5a.75.75 0 00-.75.75v8.25a.75.75 0 00.75.75h8.25a.75.75 0 00.75-.75v-8.25a.75.75 0 00-.75-.75H12z",
  clipboard: "M11.25 2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM12 6a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5h-.008A.75.75 0 0112 6zM13.5 9a.75.75 0 00-.75.75v.008a.75.75 0 001.5 0v-.008a.75.75 0 00-.75-.75zM12 12a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5h-.008A.75.75 0 0112 12zM10.5 15a.75.75 0 00-.75.75v.008a.75.75 0 001.5 0v-.008a.75.75 0 00-.75-.75zM6 6a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H6.75A.75.75 0 016 6zM7.5 9a.75.75 0 00-.75.75v.008a.75.75 0 001.5 0v-.008A.75.75 0 007.5 9zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H6.75A.75.75 0 016 12zM10.5 6a.75.75 0 00-.75.75v.008a.75.75 0 001.5 0V6.75a.75.75 0 00-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 010 1.5H6.75A.75.75 0 016 15zM4.5 9a.75.75 0 00-.75.75v.008a.75.75 0 001.5 0v-.008A.75.75 0 004.5 9z",
};

// Main App Component
export default function App() {
  // State for user inputs
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [workoutFrequency, setWorkoutFrequency] = useState('3-4');
  const [dietaryNeeds, setDietaryNeeds] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
  });
  const [otherRestrictions, setOtherRestrictions] = useState('');
  
  // State for API response and loading status
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [error, setError] = useState('');

  // Handler for checkbox changes
  const handleDietaryChange = (e) => {
    const { name, checked } = e.target;
    setDietaryNeeds(prev => ({ ...prev, [name]: checked }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || !height) {
        setError('Please enter both weight and height.');
        return;
    }
    setError('');
    setIsLoading(true);
    setGeneratedPlan('');

    // --- PROMPT ENGINEERING ---
    // Constructing a detailed prompt for the Gemini API
    const selectedDietaryNeeds = Object.entries(dietaryNeeds)
      .filter(([_, isSelected]) => isSelected)
      .map(([need]) => need.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
      .join(', ');

    const prompt = `
      You are an expert fitness and nutrition coach. Generate a personalized 7-day workout and meal plan based on the following user details. The response should be formatted in clean markdown.

      User Details:
      - Weight: ${weight} lbs
      - Height: ${height} inches
      - Desired Workout Frequency: ${workoutFrequency} times a week
      - Dietary Needs: ${selectedDietaryNeeds.length > 0 ? selectedDietaryNeeds : 'None specified'}
      - Other Restrictions or Preferences: ${otherRestrictions.length > 0 ? otherRestrictions : 'None specified'}

      Please provide two main sections: "Workout Plan" and "Meal Plan".
      For the Workout Plan, detail the exercises for each workout day, including sets, reps, and rest periods.
      For the Meal Plan, provide options for breakfast, lunch, dinner, and two snacks for each of the 7 days, ensuring all dietary restrictions are met.
    `;

    // --- GEMINI API CALL (Placeholder) ---
    // In a real application, you would make the API call here.
    // Replace this setTimeout with your fetch call to your backend,
    // which will then securely call the Gemini API.
    try {
      // **IMPORTANT**: This is where you would call your backend API
      // const response = await fetch('/api/generate-plan', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt })
      // });
      // const data = await response.json();
      // setGeneratedPlan(data.plan);

      // Simulating a network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = `
### Workout Plan (${workoutFrequency} times a week)

**Day 1: Full Body Strength**
* Squats: 3 sets of 10-12 reps
* Push-ups: 3 sets to failure
* Bent-Over Rows: 3 sets of 10-12 reps
* Plank: 3 sets, hold for 45-60 seconds

**Day 2: Cardio & Core**
* Running/Cycling: 30 minutes moderate intensity
* Crunches: 3 sets of 15-20 reps
* Leg Raises: 3 sets of 15-20 reps

**Day 3: Rest**

...and so on for the week.

### Meal Plan

**Day 1**
* **Breakfast:** Oatmeal with berries and almonds.
* **Lunch:** Grilled chicken salad with mixed greens.
* **Dinner:** Baked salmon with quinoa and steamed broccoli.
* **Snacks:** Greek yogurt, apple with peanut butter.

...and so on for the week.
      `;
      setGeneratedPlan(mockResponse);

    } catch (err) {
      setError('Failed to generate a plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4">
      <main className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* --- LEFT COLUMN: INPUT FORM --- */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-center text-cyan-400">Personalize Your Plan</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">Weight (lbs)</label>
                <input type="number" id="weight" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" placeholder="e.g., 165" />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">Height (in)</label>
                <input type="number" id="height" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none" placeholder="e.g., 70" />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label htmlFor="workoutFrequency" className="block text-sm font-medium text-gray-300 mb-1">Activity Level</label>
              <select id="workoutFrequency" value={workoutFrequency} onChange={e => setWorkoutFrequency(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
                <option value="1-2">1-2 workouts/week</option>
                <option value="3-4">3-4 workouts/week</option>
                <option value="5-7">5-7 workouts/week</option>
              </select>
            </div>

            {/* Dietary Needs */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                <Icon path={ICONS.leaf} className="w-5 h-5 text-green-400"/>
                Dietary Needs
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.keys(dietaryNeeds).map(need => (
                  <label key={need} className="flex items-center space-x-2 bg-gray-700 p-2 rounded-md cursor-pointer hover:bg-gray-600">
                    <input type="checkbox" name={need} checked={dietaryNeeds[need]} onChange={handleDietaryChange} className="form-checkbox h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-500 focus:ring-cyan-600" />
                    <span>{need.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other Restrictions */}
            <div>
               <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-2">
                <Icon path={ICONS.clipboard} className="w-5 h-5 text-yellow-400"/>
                Other Restrictions/Preferences
              </h3>
              <textarea
                value={otherRestrictions}
                onChange={e => setOtherRestrictions(e.target.value)}
                rows="3"
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="e.g., no fish, allergic to strawberries, prefer high-protein meals..."
              ></textarea>
            </div>
            
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate My Plan'
              )}
            </button>
          </form>
        </div>

        {/* --- RIGHT COLUMN: OUTPUT DISPLAY --- */}
        <div className="bg-gray-900 rounded-lg p-6 h-[70vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400 border-b border-gray-700 pb-2">Your Custom Plan</h2>
          {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Icon path={ICONS.dumbbell} className="w-12 h-12 animate-bounce text-cyan-500" />
                  <p className="mt-4 text-lg">Crafting your personalized plan...</p>
              </div>
          )}
          {generatedPlan && (
            <div className="prose prose-invert prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: generatedPlan.replace(/\n/g, '<br />') }}>
              {/* The generated markdown content will be rendered here */}
            </div>
          )}
          {!isLoading && !generatedPlan && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                <Icon path={ICONS.clipboard} className="w-12 h-12 mb-4"/>
                <p>Your generated workout and meal plan will appear here once you fill out the form.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
