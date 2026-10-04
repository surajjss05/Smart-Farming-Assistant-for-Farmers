# KisanAI - Smart Farming Assistant

KisanAI is an AI-powered Smart Farming Assistant that helps farmers with crop recommendations, yield forecasting, pest & disease detection, real-time market prices, and multilingual agronomy advice.

The application is built with a React frontend and an Express backend, leveraging the Google Gemini API for intelligent advisory and vision-based disease detection, and Open-Meteo for hyper-local agricultural weather forecasts.

## Features

- **Hyper-Local Agricultural Weather:** Fetches live weather data via Open-Meteo and cross-references it with local agro-climatic zones to provide highly specific farming advisories (e.g., spraying windows, irrigation needs).
- **Multilingual Farming Chatbot:** An AI chatbot (using Gemini API) capable of answering farming queries in English, Hindi, and Marathi. It handles real-time web grounding to fetch the latest market prices or disease outbreaks.
- **Crop Recommendation System:** Recommends optimal crops based on soil health, pH, land size, and season, complete with risk and profit estimations.
- **Pest & Disease Detection:** Analyzes uploaded images of crops using Gemini Vision to detect diseases or nutrient deficiencies and provides both organic and chemical remedies.
- **Market Intelligence:** Offers up-to-date APMC Mandi prices, trends, and logistics planning to help farmers sell at the right time and place.
- **Yield Forecasting & Profit Optimization:** Forecasts crop yields and suggests ways to optimize costs and maximize margins.

## Tech Stack

- **Frontend:** React 19, Tailwind CSS 4, Vite, Motion, Recharts, Lucide React
- **Backend:** Express, Node.js, TSX
- **AI & Data:** Google GenAI SDK (Gemini 3.5 Flash & Gemini 3.8 Flash), Open-Meteo (Weather API)

## Getting Started

### Prerequisites

- Node.js >= 22
- A Google Gemini API Key

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory (you can copy from `.env.example` if it exists) and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Running the App

To run the application in development mode (which starts both the Vite frontend and Express server):

```bash
npm run dev
```

The app will be available on the port logged in the console (default is `3000`).

### Building for Production

To create a production build of the frontend:

```bash
npm run build
```

Then, you can start the production server:

```bash
npm run start
```
