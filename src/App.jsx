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
  const [goal, setGoal] = useState('maintain');
  const [trainingFocus, setTrainingFocus] = useState('evenSplit');
  const [dietaryNeed, setDietaryNeed] = useState('none');
  const [weeklyGroceries, setWeeklyGroceries] = useState('');
  const [rewardPreference, setRewardPreference] = useState('');
  const [weeklySavingsEstimate, setWeeklySavingsEstimate] = useState(null);
  const [otherRestrictions, setOtherRestrictions] = useState('');
  const [projectionDays, setProjectionDays] = useState(30);
  
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

  // (dietary need is now a compact select)

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
    const selectedDietaryNeeds = dietaryNeed === 'none' ? 'None specified' : dietaryNeed.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

    // Simple heuristic for weekly savings: suggest 10-20% savings by smarter meal planning
    let savingsEstimate = null;
    const groceriesNum = parseFloat(weeklyGroceries);
    if (!isNaN(groceriesNum) && groceriesNum > 0) {
      // assume we can save 12% conservatively
      savingsEstimate = +(groceriesNum * 0.12).toFixed(2);
      setWeeklySavingsEstimate(savingsEstimate);
    } else {
      setWeeklySavingsEstimate(null);
    }

    const prompt = `
      You are an expert fitness and nutrition coach. Produce a 7-day workout and meal plan based on the user details below.

      User Details:
      - Weight: ${weight} lbs
      - Height: ${height} inches
      - Desired Workout Frequency: ${workoutFrequency} times a week
      - Goal: ${goal}
      - Training Focus: ${trainingFocus}
      - Dietary Needs: ${selectedDietaryNeeds}
      - Other Restrictions: ${otherRestrictions.length > 0 ? otherRestrictions : 'None'}
      - Weekly groceries budget: ${!isNaN(groceriesNum) && groceriesNum > 0 ? `$${groceriesNum}` : 'Not provided'}
      - Weekly reward: ${rewardPreference.length > 0 ? rewardPreference : 'Not specified'}

      Constraints (follow these precisely):
      - Output only two top-level sections, in this order: "Workout Plan" and then "Meal Plan". Use markdown headings for sections.
      - Workout Plan: For each day include detailed, actionable guidance. Use a single bullet per day but include exercises with brief sets/reps/tempo/rest inline. Example: '- Day 1: Squat 3x5 (3s down/1s up, 90s rest); Bench 3x5; Row 3x8; Core: Plank 3x45s'.
      - Meal Plan: Keep meals concise. One-line per day listing breakfast/lunch/dinner with simple swaps for dietary needs.
      - Keep each day's line to ~30 words for Workout (slightly more allowed for details) and ≤25 words for Meal lines.
      - Do NOT include long explanations, background science, or extra commentary — only the two sections and their per-day lines.
      - Prefer whole-food, budget-friendly swaps to help reduce weekly groceries by about ${savingsEstimate ? `$${savingsEstimate}` : '10-15%'}; mention saved money as weekly reward if present.

      Tone: Practical and precise. End output after the two sections.
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

  // Sample plan for quick testing
  const SAMPLE_PLAN = `# 7-Day Sample Plan

Workout Plan
- Day 1: Full Body; Squats/Press/Rows (3x8)
- Day 2: Cardio 30 min
- Day 3: Upper Hypertrophy (4x10)
- Day 4: Active Recovery
- Day 5: Lower Power (3x5)
- Day 6: Cardio + Core
- Day 7: Rest

Meal Plan
- Day 1: B: Oats+Protein; L: Chicken+Rice; D: Salmon+Veg
- Day 2: B: Yogurt+Fruit; L: Tuna Wrap; D: Stir-fry
- Day 3: B: Eggs+Toast; L: Turkey Salad; D: Beef+Potatoes
- Day 4: B: Smoothie; L: Quinoa Bowl; D: Veg Curry
- Day 5: B: Pancakes+Protein; L: Chicken Bowl; D: Fish+Rice
- Day 6: B: Omelette; L: Wrap; D: Pasta+Veg
- Day 7: B: Yogurt; L: Leftovers; D: Light Dinner
`;

  const useSamplePlan = () => {
    // populate plausible defaults and the sample plan
    setWeight('165');
    setHeight('70');
    setWeeklyGroceries('120');
    setRewardPreference('Movie night');
    setWeeklySavingsEstimate(+(120 * 0.12).toFixed(2));
    setGeneratedPlan(SAMPLE_PLAN);
    setIsLoading(false);
    setError('');
  };

  // Lightweight projection helper for before/after stats (30-day)
  // Lightweight projection helper for before/after stats (configurable days)
  const computeProjections = (days = projectionDays) => {
    const startWeight = parseFloat(weight) || 165;
    const heightNum = parseFloat(height) || 70;

    // parse workout frequency like '3-4' -> average
    const parseSessions = (s) => {
      if (!s) return 3.5;
      if (s.includes('-')) {
        const [a,b] = s.split('-').map(x => parseFloat(x));
        if (!isNaN(a) && !isNaN(b)) return (a + b) / 2;
      }
      const n = parseFloat(s);
      return isNaN(n) ? 3.5 : n;
    };

    const sessionsPerWeek = parseSessions(workoutFrequency);

    // estimate calories
    const maintenance = startWeight * 15; // rough kcal/day

    // per-session burn estimate
    let perSession = 400;
    if (sessionsPerWeek <= 2) perSession = 250;
    else if (sessionsPerWeek <= 4) perSession = 400;
    else perSession = 550;
    // adjust per-session burn by training focus
    if (trainingFocus === 'cardio') {
      perSession = Math.round(perSession * 1.15);
    } else if (trainingFocus === 'weight') {
      perSession = Math.round(perSession * 1.05);
    }

    const extraBurnPerDay = (perSession * sessionsPerWeek) / 7;

    // infer dietary target from explicit goal or plan text
    const gp = (generatedPlan || '').toLowerCase();
    let dietDeficitPerDay = 0;
    if (goal === 'cut') dietDeficitPerDay = 500;
    else if (goal === 'bulk') dietDeficitPerDay = -300;
    else {
      if (gp.includes('deficit') || gp.includes('lose') || gp.includes('cut')) dietDeficitPerDay = 500;
      if (gp.includes('gain') || gp.includes('surplus') || gp.includes('bulk')) dietDeficitPerDay = -300;
    }

    // net daily deficit (positive = deficit)
    const netDailyDeficit = dietDeficitPerDay + extraBurnPerDay;

    // 30-day weight change (lbs)
  // days weight change (lbs)
  const weightChangeLbs = +(((netDailyDeficit * days) / 3500)).toFixed(2);
    const endWeight = +(startWeight - weightChangeLbs).toFixed(2);

    const computeBMI = (lbs, inches) => {
      const kg = lbs / 2.20462;
      const m = (inches * 2.54) / 100;
      if (m <= 0) return null;
      return +(kg / (m * m)).toFixed(1);
    };

    const startBMI = computeBMI(startWeight, heightNum);
    const endBMI = computeBMI(endWeight, heightNum);

    // body composition split heuristic
    const lossIsPositive = weightChangeLbs > 0; // positive means losing lbs
    let fatChange = 0;
    let leanChange = 0;
    if (weightChangeLbs > 0) {
      fatChange = +(weightChangeLbs * 0.6).toFixed(2);
      leanChange = +(weightChangeLbs * 0.4).toFixed(2);
      // both are losses
      const fatStart = +(startWeight * 0.22).toFixed(2);
      const fatEnd = +(fatStart - fatChange).toFixed(2);
      const leanStart = +(startWeight - fatStart).toFixed(2);
      const leanEnd = +(leanStart - leanChange).toFixed(2);
      return { startWeight, endWeight, startBMI, endBMI, fatStart, fatEnd, leanStart, leanEnd };
    } else if (weightChangeLbs < 0) {
      // gaining weight (negative weightChangeLbs)
      const gain = -weightChangeLbs;
      fatChange = +(gain * 0.4).toFixed(2);
      leanChange = +(gain * 0.6).toFixed(2);
      const fatStart = +(startWeight * 0.22).toFixed(2);
      const fatEnd = +(fatStart + fatChange).toFixed(2);
      const leanStart = +(startWeight - fatStart).toFixed(2);
      const leanEnd = +(leanStart + leanChange).toFixed(2);
      return { startWeight, endWeight, startBMI, endBMI, fatStart, fatEnd, leanStart, leanEnd };
    } else {
      const fatStart = +(startWeight * 0.22).toFixed(2);
      const fatEnd = fatStart;
      const leanStart = +(startWeight - fatStart).toFixed(2);
      const leanEnd = leanStart;
      return { startWeight, endWeight, startBMI, endBMI, fatStart, fatEnd, leanStart, leanEnd };
    }
  };


  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans flex flex-col">
      <header className="w-full p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-black/80 border-b border-slate-800 flex items-center justify-center shadow-lg">
        <div className="flex items-center gap-3">
          {/* Inline logo: stylized dumbbell with spark */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="9" width="20" height="6" rx="1" fill="white" opacity="0.12" />
              <rect x="4" y="7" width="2" height="10" rx="0.5" fill="white" />
              <rect x="18" y="7" width="2" height="10" rx="0.5" fill="white" />
              <circle cx="8" cy="12" r="1.2" fill="#fff" opacity="0.9" />
              <circle cx="16" cy="12" r="1.2" fill="#fff" opacity="0.9" />
              <path d="M20 4l1.5 2-2 0.5" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Muscle & Hustle <span className="text-sm font-medium text-emerald-300">AI</span></h1>
            <div className="text-xs text-slate-400">Personalized workouts & meal plans</div>
          </div>
        </div>
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

            {/* Activity Level + Dietary Needs in one row */}
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
                  <option value="glutenFree">Gluten-free</option>
                  <option value="dairyFree">Dairy-free</option>
                  <option value="nutFree">Nut-free</option>
                  <option value="pescatarian">Pescatarian</option>
                </select>
              </div>
            </div>

            {/* Goal + Training Focus (one row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-slate-400 mb-1">Goal</label>
                <select id="goal" value={goal} onChange={e => setGoal(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="maintain">Maintain</option>
                  <option value="cut">Cut (lose fat)</option>
                  <option value="bulk">Bulk (gain muscle)</option>
                </select>
              </div>
              <div>
                <label htmlFor="trainingFocus" className="block text-sm font-medium text-slate-400 mb-1">Training Focus</label>
                <select id="trainingFocus" value={trainingFocus} onChange={e => setTrainingFocus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="evenSplit">Even split</option>
                  <option value="cardio">Cardio focus</option>
                  <option value="weight">Weight training focus</option>
                </select>
              </div>
            </div>

            {/* Weekly groceries and reward inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weeklyGroceries" className="block text-sm font-medium text-slate-400 mb-1">Weekly groceries ($)</label>
                <input type="number" id="weeklyGroceries" value={weeklyGroceries} onChange={e => setWeeklyGroceries(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., 120" />
              </div>
              <div>
                <label htmlFor="rewardPreference" className="block text-sm font-medium text-slate-400 mb-1">Weekly reward (what you'd like)</label>
                <input type="text" id="rewardPreference" value={rewardPreference} onChange={e => setRewardPreference(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., movie night, new shoes" />
              </div>
            </div>

            {/* Other Restrictions */}
            <div>
               <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2 mb-2">
                <Icon path={ICONS.clipboard} className="w-5 h-5 text-yellow-400"/>
                Other Restrictions/Preferences
              </h3>
              <input
                type="text"
                value={otherRestrictions}
                onChange={e => setOtherRestrictions(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., no fish, allergic to strawberries, prefer high-protein meals..."
              />
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
            <button type="button" onClick={useSamplePlan} className="w-full mt-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-3 rounded-md">
              Use Sample Plan
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
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-300">Potential weekly reward: <span className="font-semibold text-green-300">{weeklySavingsEstimate ? `$${weeklySavingsEstimate}` : '—'}</span></div>
                  <div className="text-sm text-slate-400">Reward: <span className="font-medium text-slate-200">{rewardPreference || 'Not specified'}</span></div>
                </div>
                {/* Render plan in two clean panels (Workout | Meal) when possible */}
                {(() => {
                  const text = generatedPlan || '';
                  // find markdown headers for Workout Plan and Meal Plan
                  const wHeaderPos = text.search(/^#{1,6}\s*Workout Plan\s*$/im);
                  const mHeaderPos = text.search(/^#{1,6}\s*Meal Plan\s*$/im);

                  const extractAfterHeader = (t, headerPos) => {
                    if (headerPos === -1) return '';
                    let start = headerPos;
                    const nl = t.indexOf('\n', headerPos);
                    if (nl !== -1) start = nl + 1;
                    else start = headerPos;
                    return t.slice(start).trim();
                  };

                  if (wHeaderPos !== -1 && mHeaderPos !== -1) {
                    // ensure order
                    const workout = text.slice((() => {
                      const nl = text.indexOf('\n', wHeaderPos);
                      return nl === -1 ? wHeaderPos : nl + 1;
                    })(), mHeaderPos).trim();
                    const meal = text.slice((() => {
                      const nl = text.indexOf('\n', mHeaderPos);
                      return nl === -1 ? mHeaderPos : nl + 1;
                    })()).trim();

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <div className="flex items-center justify-between">
                            <h4 className="text-blue-300 font-semibold">Workout Plan</h4>
                          </div>
                          <div className="mt-3 prose prose-invert prose-sm md:prose-base max-w-none prose-ul:list-disc prose-ul:pl-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{workout}</ReactMarkdown>
                          </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <div className="flex items-center justify-between">
                            <h4 className="text-emerald-300 font-semibold">Meal Plan</h4>
                          </div>
                          <div className="mt-3 prose prose-invert prose-sm md:prose-base max-w-none prose-ul:list-disc prose-ul:pl-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{meal}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // fallback: render full markdown inside a cleaner panel
                  return (
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 prose prose-invert prose-sm md:prose-base max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                    </div>
                  );
                })()}
              </>
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
      {/* Before / After stats (full-width) */}
      {generatedPlan && (() => {
        try {
          const { startWeight, endWeight, startBMI, endBMI, fatStart, fatEnd, leanStart, leanEnd } = computeProjections();
          const deltaWeight = +(endWeight - startWeight).toFixed(2);
          const deltaBMI = startBMI && endBMI ? +(endBMI - startBMI).toFixed(1) : null;

          return (
            <>
            <section className="w-full max-w-7xl mx-auto mt-6 p-4 bg-slate-900/30 rounded-lg border border-slate-800">
              <h3 className="text-blue-300 font-semibold mb-3">Projected Change (30 days)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Weight box */}
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg,#0ea5e9 0%, #0369a1 100%)' }}>
                  <div className="text-xs text-slate-100/80">Weight</div>
                  <div className="mt-2 text-slate-50">
                    <div className="text-lg font-bold">{startWeight} lb <span className="text-sm text-slate-200">→</span> {endWeight} lb</div>
                    <div className="text-sm mt-1">Change: <span className="font-semibold">{deltaWeight > 0 ? `+${deltaWeight}` : `${deltaWeight}`} lb</span></div>
                  </div>
                </div>

                {/* BMI box */}
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg,#a78bfa 0%, #7c3aed 100%)' }}>
                  <div className="text-xs text-slate-100/80">BMI</div>
                  <div className="mt-2 text-slate-50">
                    <div className="text-lg font-bold">{startBMI ?? '—'} <span className="text-sm text-slate-200">→</span> {endBMI ?? '—'}</div>
                    <div className="text-sm mt-1">Change: <span className="font-semibold">{deltaBMI ? (deltaBMI > 0 ? `+${deltaBMI}` : `${deltaBMI}`) : '—'}</span></div>
                  </div>
                </div>

                {/* Body composition box */}
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg,#34d399 0%, #059669 100%)' }}>
                  <div className="text-xs text-slate-100/80">Body Composition</div>
                  <div className="mt-2 text-slate-50">
                    <div className="text-sm">Fat: <span className="font-semibold">{fatStart} lb</span> → <span className="font-semibold">{fatEnd} lb</span></div>
                    <div className="text-sm mt-1">Lean: <span className="font-semibold">{leanStart} lb</span> → <span className="font-semibold">{leanEnd} lb</span></div>
                  </div>
                </div>
              </div>
            </section>
            {/* Net change graph and days selector */}
            <section className="w-full max-w-7xl mx-auto mt-4 p-4 bg-slate-900/30 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-blue-300 font-semibold">Net Change Graph</h4>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-400">Projection days</label>
                  <select value={projectionDays} onChange={e => setProjectionDays(parseInt(e.target.value, 10))} className="bg-slate-800 border border-slate-700 rounded-md p-1 text-sm text-slate-200">
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={14}>14</option>
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                    <option value={90}>90</option>
                    <option value={180}>180</option>
                    <option value={365}>365</option>
                  </select>
                </div>
              </div>

              {/* darker themed SVG graph */}
              <div className="w-full bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-transparent p-4 rounded-md">
                {/* Build a simple line graph of weight over the selected days */}
                {(() => {
                  const days = projectionDays;
                  const start = parseFloat(weight) || 165;
                  const { startWeight: sW } = computeProjections(0); // ensure start values
                  // compute daily weights
                  const gp = (generatedPlan || '').toLowerCase();
                  const sessionsPerWeek = (() => {
                    if (!workoutFrequency) return 3.5;
                    if (workoutFrequency.includes('-')) {
                      const [a,b] = workoutFrequency.split('-').map(x => parseFloat(x));
                      if (!isNaN(a) && !isNaN(b)) return (a + b) / 2;
                    }
                    const n = parseFloat(workoutFrequency);
                    return isNaN(n) ? 3.5 : n;
                  })();

                  // reuse computeProjections math to get netDailyDeficit
                  const maintenance = start * 15;
                  let perSession = 400;
                  if (sessionsPerWeek <= 2) perSession = 250;
                  else if (sessionsPerWeek <= 4) perSession = 400;
                  else perSession = 550;
                  if (trainingFocus === 'cardio') perSession = Math.round(perSession * 1.15);
                  else if (trainingFocus === 'weight') perSession = Math.round(perSession * 1.05);
                  const extraBurnPerDay = (perSession * sessionsPerWeek) / 7;
                  let dietDeficitPerDay = 0;
                  if (goal === 'cut') dietDeficitPerDay = 500;
                  else if (goal === 'bulk') dietDeficitPerDay = -300;
                  else {
                    if (gp.includes('deficit') || gp.includes('lose') || gp.includes('cut')) dietDeficitPerDay = 500;
                    if (gp.includes('gain') || gp.includes('surplus') || gp.includes('bulk')) dietDeficitPerDay = -300;
                  }
                  const netDailyDeficit = dietDeficitPerDay + extraBurnPerDay;

                  // create points
                  const points = [];
                  for (let d = 0; d <= days; d++) {
                    const delta = ((netDailyDeficit * d) / 3500);
                    const w = +(start - delta).toFixed(3);
                    points.push({ d, w });
                  }

                  // SVG sizing
                  const width = 900;
                  const height = 160;
                  const pad = 20;
                  const minW = Math.min(...points.map(p => p.w));
                  const maxW = Math.max(...points.map(p => p.w));
                  const range = Math.max(0.1, maxW - minW);

                  const mapX = (d) => pad + (d / days) * (width - pad * 2);
                  const mapY = (w) => pad + ((maxW - w) / range) * (height - pad * 2);

                  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p.d)} ${mapY(p.w)}`).join(' ');

                  return (
                    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="120" preserveAspectRatio="xMidYMid meet">
                      {/* gradient background */}
                      <defs>
                        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#020617" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#071129" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id="lineGlow" x1="0" x2="1">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.9" />
                        </linearGradient>
                      </defs>

                      <rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" rx="8" />

                      {/* y grid lines */}
                      {[0, .25, .5, .75, 1].map((t, idx) => {
                        const y = pad + t * (height - pad * 2);
                        const labelVal = +(maxW - t * range).toFixed(1);
                        return (
                          <g key={idx}>
                            <line x1={pad} x2={width - pad} y1={y} y2={y} stroke="#0b1220" strokeWidth="1" />
                            <text x={6} y={y + 4} fill="#94a3b8" fontSize="10">{labelVal} lb</text>
                          </g>
                        );
                      })}

                      {/* area under curve */}
                      <path d={`${pathD} L ${mapX(days)} ${height - pad} L ${mapX(0)} ${height - pad} Z`} fill="rgba(14,165,233,0.08)" />

                      {/* main line */}
                      <path d={pathD} fill="none" stroke="url(#lineGlow)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

                      {/* points */}
                      {points.map((p, i) => (
                        <circle key={i} cx={mapX(p.d)} cy={mapY(p.w)} r={i === 0 || i === points.length - 1 ? 3.5 : 2} fill={i === 0 || i === points.length - 1 ? '#34d399' : '#06b6d4'} />
                      ))}

                      {/* labels */}
                      <text x={pad} y={height - 6} fill="#cbd5e1" fontSize="11">Day 0</text>
                      <text x={width - pad - 30} y={height - 6} fill="#cbd5e1" fontSize="11">Day {days}</text>
                    </svg>
                  );
                })()}
              </div>
            </section>
            </>
          );
        } catch (err) {
          return null;
        }
      })()}
    </div>
  );
}
