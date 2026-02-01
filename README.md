<h1 align="center">🚀 Advanced Social Media Platform (MERN + Realtime)</h1>

<p align="center"> 
  <img src="https://img.shields.io/badge/Frontend-React%20JS-blue?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Backend-Node%20%26%20Express-green?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge" /> 
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Realtime-Socket.io-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/State-Context%20API-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Styling-Styled%20Components-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Media-Cloudinary-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-red?style=for-the-badge" />
</p> 

<p align="center">
  A <b>production-ready Full Stack Social Media Platform</b> built using the 
  <b>MERN stack</b> with <b>real-time features</b> as part of an internship-level advanced project.  
  Users can <b>register, login, create posts, upload media, like, comment, chat in real time</b>, 
  and receive <b>live notifications</b>.  
  Built following <b>real-world full stack architecture & deployment practices</b>.
</p>

---

## 🚀 Live Demo  

🔗 **Frontend:**  [🚀 Advanced Social Media Platform Frontend](https://advanced-social-media-platform.vercel.app)

🔗 **Backend API:**  [🚀 Advanced Social Media Platform Backend](https://advanced-social-media-platform.onrender.com)

---

## 🎯 Features

### 🔐 Authentication & Security
- User registration & login
- JWT-based authentication
- Protected routes
- Secure password hashing
- Rate limiting & security headers

### 📰 Post & Feed System
- Create, edit & delete posts
- Upload images/videos (Cloudinary)
- Infinite scrolling feed
- Optimistic UI updates
- Author-only edit/delete

### ❤️ Interactions
- Like / Unlike posts
- Add comments on posts
- Real-time feed updates via Socket.io

### 💬 Real-Time Chat
- One-to-one private chats
- Real-time messaging using Socket.io
- Typing indicators
- Message persistence in database

### 🔔 Notifications
- Live notifications for:
  - Likes
  - Comments
  - New messages
- Notification dropdown in navbar

### 🎨 UI / UX
- Fully responsive modern UI
- Styled Components
- Skeleton loaders
- Error & loading states handled globally

---

## 🛠️ Technologies Used

### Frontend
- **React JS (Vite)**
- **React Router DOM**
- **Context API**
- **Axios (with interceptors)**
- **Styled Components**
- **Socket.io Client**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose ODM**
- **JWT Authentication**
- **Socket.io**
- **Multer**
- **Cloudinary**

### Testing & Quality
- **Jest**
- **Supertest**
- **Vitest**
- **React Testing Library**

### Deployment
- **Frontend:** Vercel  
- **Backend:** Render  

---

## 🧠 How the Application Works

1. User registers or logs in
2. JWT token is issued and stored securely
3. Auth state managed using Context API
4. Protected routes restrict unauthenticated access
5. Users create posts with text & media
6. Feed updates in real time using Socket.io
7. Users chat privately with live typing indicators
8. Notifications are pushed instantly
9. Frontend communicates with backend via REST APIs
10. CI/CD handled via GitHub → Vercel / Render

---

## 🗂️ Project Structure

```bash
advanced-social-media-platform/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   ├── tests/
│   ├── app.js
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── styles/
│   ├── public/
│   ├── vercel.json
│   └── .env.example
├── .github/workflows/
├── .gitignore
└── README.md
```

---

## 🔌 Backend API Endpoints

```bash
POST   /api/auth/register
POST   /api/auth/login

GET    /api/posts
POST   /api/posts                (auth)
PUT    /api/posts/:id            (auth & owner)
DELETE /api/posts/:id            (auth & owner)
PUT    /api/posts/:id/like       (auth)
POST   /api/posts/:id/comments   (auth)

POST   /api/chats                (auth)
GET    /api/chats                (auth)

POST   /api/messages             (auth)
GET    /api/messages/:chatId     (auth)

PUT    /api/users/avatar         (auth)

```

## 🔧 Setup Instructions (Local Development)

### 📦 Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account
- Git

### 🪄 Backend Setup

```bash
cd backend
npm install
```

### Create .env:

```bash
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
FRONTEND_URL=http://localhost:5173
```

### Run server:

```bash
npm run dev
```

### 🧠 Frontend Setup

```bash
cd frontend
npm install
```

### Create .env:

```bash
VITE_API_URL=http://localhost:5000
```

### Run app:

```bash
npm run dev
```

---

## 📦 Deployment

### Frontend (Vercel)

- Root Directory: frontend
- Environment variable:
```bash
  VITE_API_URL=https://advanced-social-media-platform.onrender.com
```

### Backend (Render)

- Root Directory: backend
- Add environment variables:
```bash
PORT=
MONGO_URI=
JWT_SECRET=
FRONTEND_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MONGO_URI_TEST=
```
---

## 🧪 Testing Checklist

- Register & login user
- Create post with media
- Like & comment
- Real-time feed update
- Chat messaging
- Typing indicator
- Notifications
- Protected routes

## 🎯 Future Improvements

- Refresh token implementation
- Group chats
- Post search & hashtags
- Redis for notifications
- Role-based access control
- Docker & Kubernetes

---

## 👨‍💻 Author

It’s me — **Sai Charan Janagama** 😄<br>
🎓 Computer Science Graduate | 🌐 Aspiring Full Stack Developer<br>
📧 [Email Me](saic89738@gmail.com) ↗<br>
🔗 [LinkedIn](https://www.linkedin.com/in/saicharanjanagama/) ↗<br>
💻 [GitHub](https://github.com/SaiCharanJanagama) ↗

---

## 💬 Feedback

If you have any feedback or suggestions, feel free to reach out!  
Your input helps me improve 🚀

