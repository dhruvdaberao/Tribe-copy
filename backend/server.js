import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import tribeRoutes from './routes/tribeRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase payload size for base64 images

// Socket.IO Connection Management
let onlineUsers = new Map();

const addUser = (userId, socketId) => {
  !onlineUsers.has(userId) && onlineUsers.set(userId, socketId);
};

const removeUser = (socketId) => {
  for (let [key, value] of onlineUsers.entries()) {
    if (value === socketId) {
      onlineUsers.delete(key);
      break;
    }
  }
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

// Middleware to make io and onlineUsers available in routes
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tribes', tribeRoutes);

app.get('/', (req, res) => {
  res.send('Tribe API is running...');
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
