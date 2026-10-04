# 🌾 KisanAI: Smart Farming Assistant

Welcome to **KisanAI**, an AI-powered Smart Farming Assistant and Decision Platform designed to empower farmers with actionable intelligence, crop advisory, yield forecasting, and more! 🚀

## 🔗 Live Application

Explore the live app here: [KisanAI Smart Farming Assistant](https://kisanai-smart-farming-assistant.ai.studio)

## 📸 Demo
<img width="1896" height="910" alt="Screenshot 2026-10-04 145003" src="https://github.com/user-attachments/assets/01af9f2c-071e-42d3-95b2-c03b3da86fd7" />

## 🛠️ Tech Stack

KisanAI is built with modern web technologies:

*   **Frontend Framework:** React ⚛️
*   **Build Tool:** Vite ⚡
*   **Language:** TypeScript 📘
*   **Styling:** Tailwind CSS 🎨
*   **Backend:** Express 🚀
*   **Data Visualization:** Recharts 📊

## 🤖 AI Assistant & API Integrations

### Google Gemini API
The heart of our AI-driven agricultural advisory and conversational bot is powered by the **Google Gemini API**. 

To enable AI features, you need to provide your Gemini API Key:
1. Create a `.env` file in the root directory (you can use `.env.example` as a reference if available).
2. Add your Gemini API key to the `.env` file (e.g., `GEMINI_API_KEY=your_api_key_here`).

### Weather Integration
Real-time weather data and alerts are seamlessly integrated using the **Open-Meteo** API. 🌤️🌧️

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### 1. Installation

Please install the dependencies using the `--legacy-peer-deps` flag to resolve any potential peer dependency conflicts:

```bash
npm install --legacy-peer-deps
```

### 2. Environment Configuration

Make sure to set up your `.env` file as mentioned above to configure your AI assistant API key.

### 3. Available Scripts

*   **Development Server:** Run the local dev server.
    ```bash
    npm run dev
    ```
*   **Build Client:** Build the production-ready application.
    ```bash
    npm run build
    ```
*   **Linting:** Run TypeScript type checking.
    ```bash
    npm run lint
    ```
*   **Start Server:** Start the node server.
    ```bash
    npm start
    ```

---
Happy Farming! 🚜💚
