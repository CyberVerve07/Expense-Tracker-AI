# Yearly Tracker AI

A personal organization tool built with Next.js, Firebase, and Google's Gemini models via Genkit. This project provides users with a yearly calendar, daily scheduling, and a suite of AI-powered tools for financial and personal well-being analysis.

---

## ✨ Core Features

- **Interactive 2026 Calendar:** A full-year calendar with dynamic seasonal themes based on Indian seasons and pre-populated with major festivals.
- **Secure User Authentication:** Firebase-powered sign-in with Google or Email/Password, with data protected by Firestore Security Rules.
- **Daily Schedule Management:** Authenticated users can log daily tasks, budgets, and work/study hours, with all data securely stored in their personal Firestore profile.
- **AI-Powered Analysis Suite:**
  - **Diary Analysis:** Extracts insights on mood, stress, and productivity from journal entries.
  - **Expense Optimization:** Provides budget analysis and saving recommendations based on income and expenses.
  - **Wellness Insights:** Correlates diary entries and spending habits to offer a holistic view of well-being.
- **Data Visualization:** Interactive charts to visualize mood trends and spending breakdowns.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI:** React 19, ShadCN UI, Tailwind CSS
- **Backend:** Firebase (Authentication & Firestore)
- **Generative AI:** Google Gemini Models via Genkit
- **Styling:** Tailwind CSS, Lucide React (Icons), Recharts (Charts)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or a compatible package manager
- Git

### Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/CyberVerve07/Expense-Tracker-AI.git
    cd Expense-Tracker-AI
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Firebase and Gemini API keys.
    ```env
    # Get this from your Firebase project settings
    NEXT_PUBLIC_FIREBASE_CONFIG={...}

    # Get this from Google AI Studio
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.
