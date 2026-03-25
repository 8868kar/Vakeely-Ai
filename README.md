# VAkeely ⚖️

VAkeely is an AI-powered Legal Assistance and Lawyer Recommendation Platform designed to democratize legal aid in India. It provides a simple, accessible way for citizens to get basic legal advice, understand their rights, and connect with verified legal professionals.

## Features

- **🤖 AI Legal Assistant**: An intelligent chatbot powered by OpenAI that analyzes user queries, classifies cases (Civil, Criminal, Constitutional, etc.), and cites relevant Indian laws (IPC, CrPC, Constitution of India).
- **👨‍⚖️ Lawyer Directory & Search**: A comprehensive directory where users can search for vetted lawyers based on specialization, experience, rating, and consultation fees.
- **📅 Appointment Booking**: Seamless booking system for users to schedule consultations with lawyers.
- **🔐 Role-based Access Control**: Distinct dashboards and access levels for Users, Lawyers, and Administrators.
- **📚 Legal Database Explorer**: A built-in repository of Indian Legal Acts (IPC, HMA, CPA, etc.) mapped directly for user reference.

## Tech Stack

- **Frontend**: React (Vite), React Router DOM, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose). Includes a temporary in-memory database fallback for quick demo setup!
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **AI Integration**: OpenAI API for legal inference and NLP

## Project Structure

```text
VAkeely/
├── client/          # React Vite Frontend Application
│   ├── src/         # UI Components, Pages, Context, API Services
│   └── package.json 
├── server/          # Node.js/Express Backend API
│   ├── config/      # DB and OpenAI Configuration
│   ├── controllers/ # Route Handlers
│   ├── models/      # Mongoose Schemas (User, Lawyer, ChatHistory, LegalAct)
│   ├── routes/      # Express API Routes
│   └── server.js    # Application Entry Point
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (optional, the project has an in-memory database configured for demoing out of the box)
- OpenAI API Key

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in a `.env` file inside the `server` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vakeely
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *(The server runs on http://localhost:5000)*

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The app runs on http://localhost:5173)*

### Default Admin Login
Upon starting the backend, a default administrator is seeded automatically:
- **Email**: `admin@vakeely.com`
- **Password**: `admin123`
- **Type**: `User (Admin Role)`

## Deployment Guide

### Backend (via Render)
1. Push your code to GitHub.
2. Link your repository to a new **Web Service** on [Render.com](https://render.com).
3. Set the **Root Directory** to `server`.
4. Ensure the **Build Command** is `npm install` and **Start Command** is `node server.js`.
5. Add the necessary Environment Variables (e.g., `PORT=5000`, `OPENAI_API_KEY`, etc.).
6. Deploy and copy the Render URL (e.g., `https://vakeely-backend.onrender.com`).

### Frontend (via Vercel)
1. Link your repository to a new Project on [Vercel](https://vercel.com).
2. Edit the **Root Directory** and set it to `client`.
3. Add a new Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://vakeely-backend.onrender.com/api` *(Make sure to use your actual Render URL and include `/api`!)*
4. Click Deploy. Vercel will automatically build the site and ensure internal React Router links work seamlessly.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
