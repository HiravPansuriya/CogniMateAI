# 🎓 AI Study Assistant

An **AI-powered learning platform** that helps students study smarter by generating summaries, answering questions from uploaded notes, creating quizzes and flashcards, and building personalized study plans.

---

## 📌 Overview

AI Study Assistant enables students to upload their study materials (PDFs/text notes) and leverage Generative AI to enhance their learning experience. The application extracts knowledge from the uploaded documents and provides intelligent features such as note summarization, question answering, quiz generation, flashcards, and study planning.

---

## ✨ Features

### 🔐 Authentication & User Management

* User Registration and Login
* JWT-based Authentication
* Protected Routes
* User Profile Management
* Logout Functionality

### 📚 Notes Management

* Upload PDF Notes
* Upload Text Notes
* Organize Notes by Subject
* View and Delete Notes
* Search and Filter Notes

### 🤖 AI Features

#### AI Summary Generator

* Generate concise summaries
* Extract key concepts
* Highlight important definitions
* Create exam-focused notes

#### Chat with Notes (RAG)

* Ask questions based on uploaded notes
* Context-aware responses
* Retrieve relevant information using Vector Search
* Restrict answers to uploaded content

#### Quiz Generator

* Multiple Choice Questions (MCQs)
* True/False Questions
* Fill-in-the-Blanks
* Instant Scoring and Feedback

#### Flashcard Generator

* Automatically generate flashcards
* Save and review flashcards
* Subject-wise organization

#### Study Planner

* Personalized study schedules
* Daily study goals
* Revision planning based on exam dates

### 📊 Dashboard & Analytics

* Total Notes Uploaded
* Quiz Performance Tracking
* Study Progress Overview
* Learning Activity History
* Subject-wise Statistics

### 🎨 User Experience

* Responsive Design
* Dark Mode Support
* Toast Notifications
* Loading Indicators
* Error Handling

---

## 🏗️ System Architecture

```text
Frontend (Next.js)
        │
        ▼
Backend API (Node.js + Express)
            │
 ┌──────────┼────────────┐
 │          │            │
 ▼          ▼            ▼
MongoDB    Gemini    Cloudinary
Atlas       API        Storage
 │
 ▼
Pinecone Vector Database
(RAG Implementation)
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js (TypeScript)
* React
* Tailwind CSS
* Axios
* React Hook Form
* Zod
* Chart.js
* Framer Motion

### Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt.js
* Multer
* PDF-Parse

### Database

* MongoDB Atlas

### AI & Vector Search

* Google Gemini API
* Pinecone Vector Database
* LangChain

### Cloud Services

* Cloudinary (File Storage)

### DevOps & Tools

* Docker
* Docker Compose
* Git & GitHub
* Postman
* VS Code

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/<your-username>/AI-Study-Assistant.git

cd AI-Study-Assistant
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000

JWT_SECRET=

MONGO_URI=

GEMINI_API_KEY=

GEMINI_API_URL=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

PINECONE_INDEX_NAME=

PINECONE_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📌 API Modules

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
POST   /api/auth/logout
```

### Notes

```text
POST   /api/notes/upload
GET    /api/notes
DELETE /api/notes/:id
```

### AI Summary

```text
POST   /api/summary/generate
```

### Chat with Notes

```text
POST   /api/chat/ask
GET    /api/chat/history
```

### Quiz

```text
POST   /api/quiz/generate
POST   /api/quiz/submit
GET    /api/quiz/history
```

### Flashcards

```text
POST   /api/flashcards/generate
GET    /api/flashcards
DELETE /api/flashcards/:id
```

### Study planner

```text
POST   /api/planner/generate
GET    /api/planner
```
