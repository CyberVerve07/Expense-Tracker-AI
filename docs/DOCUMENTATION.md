# Yearly Tracker 2026 - Project Documentation

## 1. Project Overview

Yearly Tracker 2026 is a personal organization tool that integrates a yearly calendar with an AI-powered assistant. It provides users a unified platform to manage daily schedules, track expenses, and gain insights into their productivity and well-being.

---

## 2. Core Features

### 2.1. Interactive 2026 Calendar
The primary user interface is an interactive calendar for the year 2026.
- **Seasonal Themes:** The UI dynamically adapts its color scheme and background effects based on the current season in India.
- **Festivals & Events:** The calendar is pre-populated with major Indian festivals, each denoted by a unique icon.
- **Visual Emphasis:** The day of Diwali features a special glowing effect for festive emphasis.

### 2.2. User Authentication
Secure authentication is handled by Firebase Authentication to provide a personalized user experience.
- **Secure Sign-In:** Users can sign in with their Google account or a traditional email and password.
- **Data Protection:** All user-specific data is linked to their unique UID and protected by Firestore Security Rules.

### 2.3. Daily Schedule Management
Authenticated users can click on any day to open a form and log their daily metrics, including tasks, budget, work priorities, and study/work hours. This data is saved to Firestore under the user's profile.

### 2.4. AI Analysis Suite
The "Expense Tracker" dashboard contains three AI-powered tools built with Genkit and Google's Gemini models.
- **Diary Analysis:** Users can paste journal entries to receive an AI-generated analysis of their mood, stress triggers, and productivity patterns.
- **Expense Optimization:** By providing their income and a list of expenses, the AI generates a personalized budget analysis.
- **Wellness Insights:** This tool analyzes diary entries and spending habits to provide a holistic view of the user's well-being.

### 2.5. Data Visualization
The dashboard includes charts built with Recharts to present AI-generated insights in an easily digestible format.
- **Mood Trend:** A line chart visualizes mood fluctuations over time.
- **Spending Breakdown:** A bar chart displays expense distribution across categories.

---

## 3. Technical Architecture

The application is built on a modern, server-centric tech stack optimized for performance and scalability.

### 3.1. Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript

### 3.2. Styling
- **CSS Framework:** Tailwind CSS
- **Component Library:** ShadCN UI
- **Icons & Charts:** Lucide React for icons and Recharts for interactive charts.

### 3.3. Backend & Database
- **Platform:** Firebase
    - **Firebase Authentication:** Manages the complete user authentication flow.
    - **Firebase Firestore:** A NoSQL, document-based database for storing user-specific data.

### 3.4. Generative AI
- **Framework:** Genkit
- **AI Models:**
    - **Gemini 2.5 Flash:** Powers all text-based analysis features.
    - **Gemini TTS Model:** Used for the text-to-speech feature.

---

## 4. Project Structure

- **`src/app/`**: Contains the core Next.js application, including layouts, pages, and route definitions.
- **`src/components/`**: Houses all reusable React components, including UI elements and feature-specific components.
- **`src/ai/`**: Contains all Genkit AI logic, including flows, prompts, and schemas.
- **`src/firebase/`**: Contains all Firebase integration code, including configuration and context providers.
- **`docs/backend.json`**: A JSON schema defining the data models and Firestore structure.
- **`firestore.rules`**: Security rules to ensure users can only access their own data.
