# Copilot Instructions for HackKnight25

## Project Overview
This is a React-based fitness and meal planning web application that generates personalized 7-day workout and meal plans using Google's Gemini AI API. The app is built with Vite, React 19, and Tailwind CSS 4.

## Architecture & Key Patterns

### Single-Component Architecture
- **Main component**: `src/App.jsx` (~217 lines) contains all application logic
- Uses React hooks (`useState`) for state management
- No routing, no component decomposition - intentionally simple, hackathon-style structure
- All UI and logic coexist in one file for rapid iteration

### API Integration Pattern
- **API Key Storage**: Gemini API key stored in `/public/Authorization/API.json` (note: actual path is `/authentication/API.json` in fetch call)
- **Client-Side API Calls**: Direct fetch to Gemini API from browser (security note: API key exposed to client)
- **Fetch Pattern**:
  ```javascript
  const keyResponse = await fetch('/authentication/API.json');
  const apiKey = keyData["Authorization"];
  const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {...});
  ```

### Prompt Engineering Approach
- Detailed, structured prompts built from user input (`weight`, `height`, `workoutFrequency`, `dietaryNeeds`, `otherRestrictions`)
- Markdown-formatted responses expected from Gemini
- Response rendered with `dangerouslySetInnerHTML` converting `\n` to `<br />`

## Tech Stack Specifics

### Tailwind CSS 4.1.14
- Uses new Vite plugin: `@tailwindcss/vite` 
- Imports via `@import "tailwindcss"` in CSS files (not traditional `@tailwind` directives)
- Utility-first styling with dark theme (bg-gray-900, text-white)
- Responsive grid: `grid-cols-1 md:grid-cols-2` for form/results layout

### React 19.1.1
- Using latest React with `createRoot` API
- StrictMode enabled in `main.jsx`
- No TypeScript - pure JavaScript with JSX

### Vite 7.1.7
- Development server: `npm run dev`
- Build: `npm run build`
- Preview production build: `npm run preview`
- Plugins: `@vitejs/plugin-react` and `@tailwindcss/vite`

## Development Workflows

### Running the App
```bash
npm run dev        # Starts dev server (HMR enabled)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### ESLint Configuration
- Modern flat config (`eslint.config.js`)
- Custom rule: `'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]` - allows unused uppercase constants (e.g., `ICONS`)
- React Hooks plugin with recommended rules
- Ignores `dist` directory

## Project-Specific Conventions

### Icon System
- Custom `Icon` component accepts `path` prop for SVG paths
- Icon definitions stored in `ICONS` constant object
- Reusable for dumbbell, leaf, and clipboard icons throughout UI

### State Management
- Form inputs: controlled components with individual `useState` hooks
- Dietary needs: checkbox state stored as object, not array
- Loading/error states managed with `isLoading` and `error` state variables

### Form Submission Flow
1. Validate required fields (weight, height)
2. Construct detailed prompt from user inputs
3. Fetch API key from JSON file
4. Call Gemini API with prompt
5. Parse response and display in right column
6. Handle errors with try/catch and user-friendly messages

## Critical Notes for Agents

### Security Considerations
- **API key is exposed in public folder** - consider this for any production deployment suggestions
- Path mismatch: File is in `/public/Authorization/API.json` but fetched as `/authentication/API.json` - this works because public files are served from root

### Styling Quirks
- `App.css` imports Tailwind but has unused legacy styles (logo animations, card styles)
- All actual styling is inline Tailwind classes in JSX
- Dark theme with cyan/blue gradient accents is the design system

### Common Modifications
- **Adding form fields**: Follow pattern in `src/App.jsx` lines 135-143 (e.g., weight/height inputs)
- **Modifying dietary options**: Update `dietaryNeeds` initial state object (line 29)
- **Changing API provider**: Replace fetch call and prompt structure (lines 97-111)
- **UI adjustments**: Modify Tailwind classes in JSX (especially grid layout on line 121)

## File Reference
- **Main app logic**: `src/App.jsx`
- **Entry point**: `src/main.jsx`
- **Styling**: `src/index.css` (Tailwind import only)
- **API config**: `public/Authorization/API.json`
- **Build config**: `vite.config.js`
- **Lint config**: `eslint.config.js`
