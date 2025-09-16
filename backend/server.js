// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import http from 'http';
// import { Server } from 'socket.io';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// import messageRoutes from './routes/messageRoutes.js';
// import tribeRoutes from './routes/tribeRoutes.js';

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // Adjust for production
//   },
// });

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' })); // Increase payload size for base64 images

// // Socket.IO Connection Management
// let onlineUsers = new Map();

// const addUser = (userId, socketId) => {
//   !onlineUsers.has(userId) && onlineUsers.set(userId, socketId);
// };

// const removeUser = (socketId) => {
//   for (let [key, value] of onlineUsers.entries()) {
//     if (value === socketId) {
//       onlineUsers.delete(key);
//       break;
//     }
//   }
// };

// io.on("connection", (socket) => {
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//   });

//   socket.on("leaveRoom", (roomId) => {
//     socket.leave(roomId);
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// // Middleware to make io and onlineUsers available in routes
// app.use((req, res, next) => {
//   req.io = io;
//   req.onlineUsers = onlineUsers;
//   next();
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/tribes', tribeRoutes);

// app.get('/', (req, res) => {
//   res.send('Tribe API is running...');
// });

// const PORT = process.env.PORT || 5001;

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



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

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tribes', tribeRoutes);


app.get('/', (req, res) => {
  res.send('Tribe API is running...');
});

// Socket.IO Logic
const userSocketMap = {}; // { userId: socketId }

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('add-user', (userId) => {
        userSocketMap[userId] = socket.id;
    });
    
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('send-message', ({ to, message }) => {
        const receiverSocketId = userSocketMap[to];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('new-message', message);
        }
    });

    socket.on('send-tribe-message', ({ roomId, message }) => {
        // Emit to all in room except the sender
        socket.to(roomId).emit('new-tribe-message', message);
    });
    
    socket.on('start-typing', ({ roomId, user }) => {
        const receiverSocketId = userSocketMap[roomId]; // For DMs, roomId is the other user's ID
        if(receiverSocketId){
             io.to(receiverSocketId).emit('user-typing', { user });
        }
    });

    socket.on('stop-typing', ({ roomId, user }) => {
       const receiverSocketId = userSocketMap[roomId];
       if(receiverSocketId){
            io.to(receiverSocketId).emit('user-stopped-typing', { user });
       }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (const userId in userSocketMap) {
            if (userSocketMap[userId] === socket.id) {
                delete userSocketMap[userId];
                break;
            }
        }
    });
});


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));