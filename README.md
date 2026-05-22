# 💬 Gutargu — Real-Time Chat Application

A modern production-ready real-time chat application built using React, Node.js, Socket.IO, MongoDB, and WebRTC.

Gutargu provides:
- ⚡ Real-time messaging
- 📞 Audio & Video Calling
- 🔔 Live notifications
- 👥 Connection system
- 🔐 JWT Authentication
- 🎥 WebRTC integration
- 📱 Fully responsive UI

---

# 🚀 Live Demo

## Frontend
```bash
(https://dev-connect-4mfi.vercel.app/)
```

# 📸 Preview

## 💬 Chat UI

![Chat UI](https://via.placeholder.com/1000x500?text=Chat+UI)

---

## 📞 Video Call

![Video Call](https://via.placeholder.com/1000x500?text=Video+Call+UI)

---

## 📱 Responsive Design

![Responsive UI](https://via.placeholder.com/1000x500?text=Responsive+UI)

---

# ✨ Features

## 🔐 Authentication
- JWT Login/Register
- Protected Routes
- Persistent Authentication
- Secure API Access

---

## 💬 Real-Time Messaging
- Instant Messaging
- Socket.IO Integration
- Live Chat Updates
- Auto Scroll
- WhatsApp-like Chat Experience

---

## 🔔 Notifications
- Real-Time Notifications
- Toast Alerts
- Sound Notifications
- Incoming Message Alerts

---

## 📞 Audio & Video Calling
- WebRTC Calling
- Audio Calls
- Video Calls
- ICE Candidate Exchange
- STUN Server Integration
- Call Accept/Reject System

---

## 👥 Social Features
- Send Connection Requests
- Accept/Reject Requests
- Connected Users Sidebar
- Real-Time User Interaction

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios
- Socket.IO Client
- WebRTC
- React Hot Toast

---

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication

---

# 🧠 Architecture

```txt
Frontend (React + Vite)
        ↓
Socket.IO Signaling
        ↓
Backend (Node.js + Express)
        ↓
MongoDB Database
        ↓
WebRTC Peer-to-Peer Calls
```

---

# 📂 Folder Structure

```bash
frontend/
│
├── src/
│   ├── api/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── pages/
│   ├── redux/
│   ├── routes/
│   ├── sounds/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

---

# ⚙️ Environment Variables

Create a `.env` file in the frontend root directory.

```env
VITE_API_BASE_URL=http://localhost:9000/api
VITE_SOCKET_URL=http://localhost:9000

# Optional TURN Server
VITE_TURN_URLS=
VITE_TURN_USERNAME=
VITE_TURN_CREDENTIAL=
```

---

# 📦 Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/gutargu-chat-app.git
```

---

## 2️⃣ Navigate to Frontend

```bash
cd frontend
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Start Development Server

```bash
npm run dev
```

---

# 🔌 Socket.IO Events

## Client Emits
```txt
join_chat
send_message
call-user
accept-call
reject-call
offer
answer
ice-candidate
end-call
```

---

## Client Listens
```txt
receive_message
new_notification
incoming-call
call-accepted
call-rejected
call-ended
ice-candidate
```

---

# 🎥 WebRTC Flow

```txt
User A
   ↓
Socket.IO Signaling
   ↓
User B

SDP + ICE Candidate Exchange
   ↓
Direct Media Connection
```

---

# 🔥 Challenges Solved

- Real-time synchronization
- WebRTC signaling
- ICE candidate handling
- Socket room management
- JWT authentication
- Persistent login state
- Real-time notifications
- Video call connection handling

---

# 📈 Future Improvements

- ✅ Group Chats
- ✅ Group Video Calls
- ✅ SFU Integration
- ✅ Screen Sharing
- ✅ File Sharing
- ✅ Voice Notes
- ✅ Message Encryption
- ✅ Redis Scaling
- ✅ Docker Deployment
- ✅ NGINX Load Balancing

---

# 🚀 Deployment

## Frontend Deployment
- Vercel
- Netlify
- Render

## Backend Deployment
- Render
- AWS EC2
- DigitalOcean

---

# 🧪 Production Features Planned

- TURN Server
- Redis Adapter
- PM2 Clustering
- Docker Support
- Media Server Scaling
- Multi-Server Architecture

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

## Rohan

B.Tech Information Technology  
Full Stack Web Developer  
Passionate about Real-Time Applications & Scalable Systems

---

# ⭐ Support

If you like this project:

⭐ Star the repository  
🍴 Fork the repository  
🛠️ Contribute to the project

---

# 💖 Built With

React • Node.js • MongoDB • Socket.IO • WebRTC • Tailwind CSS
