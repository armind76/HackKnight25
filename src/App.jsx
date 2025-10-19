import React, { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [dietaryNeed, setDietaryNeed] = useState('none');
  const [otherRestrictions, setOtherRestrictions] = useState('');
  const [travelDistance, setTravelDistance] = useState('');
  const [goal, setGoal] = useState('bulk');
  const [focus, setFocus] = useState('buildMuscle');
  const [trainingSplit, setTrainingSplit] = useState('evenSplit');
  const [gymTime, setGymTime] = useState('afternoon');
  
  // State for API response and loading status
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [error, setError] = useState('');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState('');

  // ElevenLabs Conversational AI setup
  const conversation = useConversation({
    onConnect: () => console.log('Connected to ElevenLabs AI'),
    onDisconnect: () => console.log('Disconnected from ElevenLabs AI'),
    onMessage: (message) => console.log('AI Message:', message),
    onError: (error) => console.error('AI Error:', error),
  });

  // Start AI conversation
  const startConversation = async () => {
    try {
      // Load API key if not already loaded
      if (!elevenLabsApiKey) {
        const keyResponse = await fetch('/Authorization/API.json');
        if (!keyResponse.ok) {
          throw new Error('Failed to load API key');
        }
        const keyData = await keyResponse.json();
        const apiKey = keyData["ElevenLabsAPI"];
        setElevenLabsApiKey(apiKey);

        // Start conversation with context about the user's plan
        await conversation.startSession({
          agentId: 'agent_4501k7spa2z9fvtb70wwzztsvze1', // Replace with your ElevenLabs agent ID
          clientTools: {},
          overrides: {
            agent: {
              prompt: {
                prompt: `You are a fitness and nutrition coach helping a user with their personalized plan. 
                User details: Weight: ${weight} lbs, Height: ${height} inches, Workout Frequency: ${workoutFrequency} times/week.
                ${generatedPlan ? `Here is their current plan:\n${generatedPlan}` : 'No plan generated yet.'}
                Help them understand their plan, answer questions, and provide motivation.`
              }
            }
          }
        });
      } else {
        await conversation.startSession({
          agentId: 'agent_4501k7spa2z9fvtb70wwzztsvze1',
        });
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError('Failed to start AI conversation. Please check your API key.');
    }
  };

  // End AI conversation
  const endConversation = async () => {
    await conversation.endSession();
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!weight || !height) {
        setError('Please enter both weight and height.');
        return;
    }
    if (weightNum <= 0 || heightNum <= 0) {
        setError('Weight and height must be positive numbers.');
        return;
    }
    if (weightNum > 2000) {
        setError('Weight cannot exceed 2000 lbs.');
        return;
    }
    if (heightNum > 120) {
        setError('Height cannot exceed 120 inches.');
        return;
    }

    setError('');
    setIsLoading(true);
    setGeneratedPlan('');

    // --- PROMPT ENGINEERING ---
    // Constructing a detailed prompt for the Gemini API
    const prompt = `
      You are an expert fitness and nutrition coach. Generate a personalized 7-day workout and meal plan based on the following user details. The response should be formatted in clean markdown.

      User Details:
      - Weight: ${weight} lbs
      - Height: ${height} inches
      - Desired Workout Frequency: ${workoutFrequency} times a week
      - Dietary Needs: ${dietaryNeed !== 'none' ? dietaryNeed : 'None specified'}
      - Other Restrictions or Preferences: ${otherRestrictions.length > 0 ? otherRestrictions : 'None specified'}
      - Travel Time to Gym: ${travelDistance} minutes
      - Primary Goal: ${goal === 'bulk' ? 'Bulk up' : 'Cut (lose weight)'}
      - Fitness Focus: ${focus === 'buildMuscle' ? 'Build Muscle' : 'Lose Fat'}
      - Training Split: ${trainingSplit === 'evenSplit' ? 'Even Split (Cardio & Weight Training)' : trainingSplit === 'cardio' ? 'Focus on Cardio' : 'Focus on Weight Training'}
      - Preferred Gym Time: ${gymTime.charAt(0).toUpperCase() + gymTime.slice(1)}

      Please provide two main sections: "Workout Plan" and "Meal Plan".
      For the Workout Plan, detail the exercises for each workout day, including sets, reps, and rest periods.
      For the Meal Plan, provide options for breakfast, lunch, dinner, and two snacks for each of the 7 days, ensuring all dietary restrictions are met.
    `;

    // --- GEMINI API CALL (Placeholder) ---
    // In a real application, you would make the API call here.
    // Replace this setTimeout with your fetch call to your backend,
    // which will then securely call the Gemini API.
    try {
        // Load API key from key.json
  const keyResponse = await fetch('/Authorization/API.json');
  if (!keyResponse.ok) {
    throw new Error(`Failed to load API key: ${keyResponse.status}`);
  }
  const keyData = await keyResponse.json();
  const apiKey = keyData["Authorization"];

  console.log('Making request to Gemini API...');
  
    // Make request to Gemini API (using gemini-pro model with v1beta)
  const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    }
  );

  console.log('Gemini response status:', geminiResponse.status);
  
  if (!geminiResponse.ok) {
    const errorData = await geminiResponse.json();
    console.error('Gemini API error:', errorData);
    throw new Error(`Gemini API error: ${errorData?.error?.message || geminiResponse.statusText}`);
  }

  const data = await geminiResponse.json();
  console.log('Gemini API response:', data);
  
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  setGeneratedPlan(text);
} catch (err) {
  console.error('Error details:', err);
  setError(`Failed to generate a plan: ${err.message}`);
} finally {
  setIsLoading(false);
}
    };


  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans flex flex-col">
      <header className="w-full p-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-blue-400">Muscle & Hustle</h1>
      </header>
      <main className="flex-grow w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        
        {/* --- LEFT COLUMN: INPUT FORM --- */}
        <div className="flex flex-col space-y-6 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
          <h2 className="text-2xl font-bold text-center text-blue-400">Personalize Your Plan</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-slate-400 mb-1">Weight (lbs)</label>
                <input type="number" id="weight" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., 165" />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-slate-400 mb-1">Height (in)</label>
                <input type="number" id="height" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., 70" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="workoutFrequency" className="block text-sm font-medium text-slate-400 mb-1">Activity Level</label>
                <select id="workoutFrequency" value={workoutFrequency} onChange={e => setWorkoutFrequency(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="1-2">1-2 workouts/week</option>
                  <option value="3-4">3-4 workouts/week</option>
                  <option value="5-7">5-7 workouts/week</option>
                </select>
              </div>
              <div>
                <label htmlFor="dietaryNeed" className="block text-sm font-medium text-slate-400 mb-1">Dietary Needs</label>
                <select id="dietaryNeed" value={dietaryNeed} onChange={e => setDietaryNeed(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="none">None</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="glutenFree">Gluten-Free</option>
                  <option value="dairyFree">Dairy-Free</option>
                  <option value="nutFree">Nut-Free</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="travelDistance" className="block text-sm font-medium text-slate-400 mb-1">Travel to Gym (minutes)</label>
                <input type="number" id="travelDistance" value={travelDistance} onChange={e => setTravelDistance(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., 20" />
              </div>
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-slate-400 mb-1">Goal</label>
                <select id="goal" value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="bulk">Bulk</option>
                  <option value="cut">Cut</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="focus" className="block text-sm font-medium text-slate-400 mb-1">Focus</label>
                <select id="focus" value={focus} onChange={e => setFocus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="buildMuscle">Build Muscle</option>
                  <option value="loseFat">Lose Fat</option>
                  <option value="maintain">Maintain</option>
                  <option value="loseFat">Body Recomposition</option>
                </select>
              </div>
              <div>
                <label htmlFor="trainingSplit" className="block text-sm font-medium text-slate-400 mb-1">Training Split</label>
                <select id="trainingSplit" value={trainingSplit} onChange={e => setTrainingSplit(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="evenSplit">Even Split</option>
                  <option value="cardio">Cardio</option>
                  <option value="weightTraining">Weight Training</option>
                </select>
              </div>
              <div>
                <label htmlFor="gymTime" className="block text-sm font-medium text-slate-400 mb-1">Gym Time</label>
                <select id="gymTime" value={gymTime} onChange={e => setGymTime(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>
            </div>


            {/* Other Restrictions */}
            <div>
               <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
                <Icon path={ICONS.clipboard} className="w-5 h-5 text-yellow-400"/>
                Other Restrictions/Preferences
              </h3>
              <textarea
                value={otherRestrictions}
                onChange={e => setOtherRestrictions(e.target.value)}
                rows="3"
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., no fish, allergic to strawberries, prefer high-protein meals..."
              ></textarea>
            </div>
            
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-slate-800 hover:from-blue-700 hover:to-slate-900 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
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
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 flex flex-col h-[calc(100vh-8rem)]">
          {/* Sticky Header */}
          <div className="flex-shrink-0 p-6 pb-4 border-b border-slate-800">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-400">Your Custom Plan</h2>
              
              {/* AI Conversation Button */}
              <button
                onClick={conversation.status === 'connected' ? endConversation : startConversation}
                disabled={conversation.status === 'connecting'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  conversation.status === 'connected'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                {conversation.status === 'connected' ? 'End Chat' : 
                 conversation.status === 'connecting' ? 'Connecting...' : 
                 'Talk to AI Coach'}
              </button>
            </div>

            {/* AI Conversation Status Indicator */}
            {conversation.status === 'connected' && (
              <div className="mt-4 p-3 bg-green-900/30 border border-green-600 rounded-lg flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-green-400 text-sm font-medium">AI Coach is listening... Speak to ask questions about your plan!</p>
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto no-scrollbar p-6">
            {isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Icon path={ICONS.dumbbell} className="w-12 h-12 animate-bounce text-blue-500" />
                    <p className="mt-4 text-lg">Crafting your personalized plan...</p>
                </div>
            )}
            {generatedPlan && (
              <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-p:text-slate-300 prose-headings:text-blue-400 prose-strong:text-slate-100 prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-blue-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {generatedPlan}
                </ReactMarkdown>
              </div>
            )}
            {!isLoading && !generatedPlan && (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 text-center">
                  <Icon path={ICONS.clipboard} className="w-12 h-12 mb-4"/>
                  <p>Your generated workout and meal plan will appear here once you fill out the form.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
