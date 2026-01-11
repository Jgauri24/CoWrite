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
# CoWrite ✍️

CoWrite is a real-time collaborative writing platform that allows multiple users to write, edit, and manage shared documents seamlessly.

## 🚀 Features
- User authentication (JWT-based)
- Secure backend architecture
- Scalable project structure
- Ready for real-time collaboration using WebSockets

## 🛠 Tech Stack
**Frontend**
- React (planned)

**Backend**
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## 📌 Status
Backend authentication and user management completed.
Real-time collaboration coming next.

---

Built with ❤️ for learning full-stack systems.
