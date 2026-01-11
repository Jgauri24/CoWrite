# CoWrite - Live Collaborative Notes App

A Notion-like collaborative document editor built with the MERN stack + Socket.io.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Auth**: JWT

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR a MongoDB Atlas account

### Backend Setup

```bash
cd backend
npm install
```




Update the `MONGODB_URI` in `.env` if needed.

### Running the Backend

Development mode (auto-reload on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### Testing the Server

Visit: http://localhost:5000/api/health

You should see:
```json
{
  "status": "OK",
  "message": "CoWrite API is running",
  "timestamp": "2026-01-11T..."
}
```

## Project Structure

```
backend/
├── config/
│   └── db.js          # MongoDB connection
├── server.js          # Express app entry point
├── .env               # Environment variables (not in git)
├── .env.example       # Template for .env
└── package.json
```

## Development Progress

- [x] Commit 1: Express server + MongoDB connection
- [ ] Commit 2: User model + JWT auth
- [ ] Commit 3: Document model + CRUD APIs
- [ ] Commit 4: Document permissions (RBAC)
- [ ] Commit 5: Socket.io integration
- [ ] ... (more commits)

---

Built step-by-step as an internship-level project.
# CoWrite
