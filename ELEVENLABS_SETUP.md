# ElevenLabs Conversational AI Setup Guide

## Overview
Your fitness app now includes an ElevenLabs conversational AI agent that users can talk to about their workout and meal plans!

## Setup Steps

### 1. Get Your ElevenLabs API Key
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up or log in
3. Navigate to your profile settings
4. Copy your API key

### 2. Create a Conversational AI Agent
1. Go to the [ElevenLabs Dashboard](https://elevenlabs.io/app/conversational-ai)
2. Click "Create New Agent"
3. Configure your agent:
   - **Name**: Fitness Coach AI
   - **Voice**: Choose a motivating, energetic voice
   - **System Prompt**: 
     ```
     You are an expert fitness and nutrition coach. You help users understand their personalized workout and meal plans, answer questions about exercises, provide nutritional guidance, and offer motivation. Be encouraging, knowledgeable, and supportive. Keep responses concise and conversational.
     ```
4. Copy the **Agent ID** (you'll need this)

### 3. Update Configuration Files

#### Update `public/Authorization/API.json`:
```json
{
    "Authorization": "YOUR_GEMINI_API_KEY",
    "ElevenLabsAPI": "YOUR_ELEVENLABS_API_KEY"
}
```

#### Update `src/App.jsx`:
Find line with `agentId: 'YOUR_AGENT_ID_HERE'` (appears twice) and replace with your actual agent ID:
```javascript
agentId: 'your-actual-agent-id-here'
```

### 4. Test the Integration
1. Run `npm run dev`
2. Generate a workout/meal plan
3. Click "Talk to AI Coach" button
4. Allow microphone permissions
5. Start speaking to the AI!

## Features

### What Users Can Do:
- 🎙️ **Voice Conversations**: Real-time voice chat with AI coach
- 💪 **Plan Explanations**: Ask about specific exercises or meals
- 📊 **Progress Tracking**: Discuss their fitness goals
- 🔄 **Plan Modifications**: Request changes or alternatives
- 💡 **Tips & Motivation**: Get encouragement and advice

### How It Works:
1. User generates a personalized plan using the form
2. User clicks "Talk to AI Coach" to start a voice conversation
3. AI has context about their plan (weight, height, preferences)
4. User can ask questions naturally like:
   - "Why did you recommend these exercises?"
   - "Can I substitute chicken with another protein?"
   - "How do I do a proper squat?"
   - "What if I miss a workout day?"

## Troubleshooting

### "Failed to start AI conversation"
- Check that your ElevenLabs API key is correct
- Verify your agent ID is properly set
- Ensure you have credits in your ElevenLabs account

### No audio/microphone issues
- Check browser permissions for microphone access
- Ensure your microphone is working
- Try a different browser (Chrome/Edge work best)

### Agent doesn't have plan context
- Generate a plan first before starting conversation
- The agent receives the user's stats and generated plan automatically

## Cost Considerations
- ElevenLabs charges based on characters processed
- Conversational AI is billed per minute of conversation
- Check your [ElevenLabs pricing](https://elevenlabs.io/pricing) for current rates
- Consider setting usage limits in your ElevenLabs dashboard

## Advanced Customization

### Modify Agent Personality
Edit the prompt override in `startConversation()` function to change how the AI behaves.

### Add Custom Tools
The `clientTools` parameter allows you to give the AI access to custom functions (e.g., "schedule workout", "save meal plan").

### Voice Selection
Change the voice in your ElevenLabs agent dashboard to match your app's vibe.

## Security Note
⚠️ Your API keys are exposed in the public folder. For production:
- Move API keys to environment variables
- Use a backend proxy to handle API calls
- Never commit real API keys to version control
