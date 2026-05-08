# 🪙 Lumina Ledger: AI-Powered Expense Intelligence

Lumina Ledger is a state-of-the-art personal finance management system that leverages Artificial Intelligence to provide deep insights into your spending habits, wellness, and future financial trends. Built with a premium design aesthetic and a cutting-edge tech stack, it transforms raw data into actionable intelligence.

![Lumina Ledger Banner](https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2022&auto=format&fit=crop)

## ✨ Features

- **🤖 AI-Powered Analysis**: Get intelligent insights from your spending diaries and expense history using Groq and Genkit.
- **📈 Predictive Forecasting**: Visualize future financial trends with AI-driven predictions.
- **🧘 Wellness Insights**: Understand the correlation between your financial habits and overall well-being.
- **📊 Interactive Dashboards**: Beautiful, dynamic charts powered by Recharts for clear financial visualization.
- **📅 Calendar View**: Track your daily expenses and schedules in an intuitive calendar interface.
- **🎯 Goal & Habit Tracking**: Set financial goals and monitor daily habits to build long-term wealth.
- **🚨 Smart Budget Alerts**: Real-time notifications and alerts when you approach your budget limits.
- **🚀 Ultra-Premium UI**: A sleek, modern interface built with Tailwind CSS, Framer Motion, and Radix UI components.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/), [Radix UI](https://www.radix-ui.com/)
- **AI/ML**: [Groq SDK](https://groq.com/), [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Visualizations**: [Recharts](https://recharts.org/), [Three.js](https://threejs.org/) (React Three Fiber)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- A Firebase project
- A Groq API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Expense-Tracker-AI.git
   cd Expense-Tracker-AI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env` in the root (and/or `frontend/.env`) and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
.
├── frontend/           # Next.js frontend application
│   ├── src/ai/         # AI flows and logic (Genkit, Groq)
│   ├── src/components/ # UI components (Shadcn, Custom)
│   ├── src/lib/        # Utility functions and configurations
│   └── src/app/        # Next.js App Router pages
├── backend/            # Backend services and Genkit flows
└── firebase.json       # Firebase configuration
```

## 🛡️ Security

Lumina Ledger implements strict Firestore security rules and Firebase Authentication to ensure your financial data remains private and secure.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
 ❤️ 
