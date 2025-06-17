# Expo Weather App

A modern weather application with AI assistant and smart notifications built with Expo and Next.js.

## Project Structure

```
expo-weather-app/
├── backend/          # Next.js API backend
├── mobile/           # Expo React Native app
└── README.md
```

## Features

- 🌤️ Real-time weather data with location awareness
- 🤖 AI weather assistant for personalized insights
- 📱 Smart weather notifications and predictions
- 📊 Hourly and daily forecasts
- 🎨 Dynamic weather animations

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Mobile Setup

1. Navigate to the mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npx expo start
```

4. Use the Expo Go app on your phone or an emulator to run the app

## API Endpoints

- `GET /api/weather/current` - Current weather data
- `GET /api/weather/hourly` - Hourly forecast
- `GET /api/weather/daily` - Daily forecast
- `POST /api/ai` - AI weather assistant

## Environment Variables

Create a `.env.local` file in the backend directory:

```env
# Weather API configuration
WEATHER_API_URL=your_weather_api_url
WEATHER_API_KEY=your_api_key

# AI configuration (optional)
OPENAI_API_KEY=your_openai_key
```

## Tech Stack

**Backend:**
- Next.js 14
- TypeScript
- Weather API integration
- OpenAI integration

**Mobile:**
- Expo SDK 49+
- React Native
- TypeScript
- Expo Notifications

## Development

Both backend and mobile apps support hot reloading. Make sure the backend is running before starting the mobile app for full functionality.
