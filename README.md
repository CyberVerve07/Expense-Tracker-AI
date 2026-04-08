# Expense Tracker AI

A modern, scalable expense tracking application built with Next.js, Genkit AI, and Firebase. This project is structured as a monorepo to clearly separate frontend aesthetics, backend intelligence, and API boundaries.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Radix UI
- **Backend / AI Services:** Genkit, Firebase, Node.js
- **Database:** Firestore
- **Tooling:** npm workspaces, TypeScript

## Folder Structure

```text
/project-root
│
├── frontend/          # All Next.js UI code, components, and frontend configs
├── backend/           # AI services, DB config, and documentation (inside backend/docs)
└── package.json       # Root workspace configuration
```

## Installation

1. From the project root, install dependencies for all workspaces:
   ```bash
   npm install
   ```

## Development Commands

- **Frontend Development:**
  ```bash
  cd frontend
  npm run dev
  ```
- **Backend / AI Development:**
  ```bash
  cd backend
  npm run dev
  ```

## Deployment Instructions

* **Frontend:** Can be deployed to Vercel or Netlify. Ensure the root directory is set to `frontend/` if deploying via Vercel directly, or configured for monorepo setups.
* **Backend / AI:** Deployable via Firebase App Hosting or Cloud Run depending on the setup configuration.
