# Global Defense Atlas 🛡️🌍

Global Defense Atlas is an interactive, AI-powered web application that provides insights into the military capabilities, defense strategies, and relative strengths of nations worldwide.

## ✨ Features

*   **Interactive World Map:** Navigate a beautifully rendered, interactive globe using `react-simple-maps`.
*   **AI-Powered Defense Scoring:** On load, the application uses Google's Gemini AI to dynamically score and rank over 150 countries based on their defense industry and military strength (0-100).
*   **Heatmap Visualization:** Countries are color-coded in shades of gold based on their AI-generated defense score.
*   **Deep Military Insights:** Click on any country to generate a real-time, AI-curated briefing, including:
    *   A concise military tagline.
    *   A one-sentence highlight of its most notable military strength.
    *   A broad military classification (e.g., 'Global Superpower', 'Regional Force').
    *   A representative emoji.
*   **Smooth Animations:** Fluid UI transitions and map interactions powered by Framer Motion.

## 🛠️ Tech Stack

*   **Frontend:** React 18, TypeScript, Tailwind CSS, Framer Motion, React Simple Maps
*   **Backend:** Node.js, Express
*   **AI Integration:** Google Gen AI SDK (`@google/genai`) using the `gemini-3.1-pro-preview` model
*   **Build Tool:** Vite

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

## 📝 License

This project is open-source and available under the MIT License.
