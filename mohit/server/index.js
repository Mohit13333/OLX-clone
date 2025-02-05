import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import chatRoutes from './routes/chat.js';
import Chat from './models/chat.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("db connected");
});

mongoose.connection.on("error", () => {
  console.log("db connection failed");
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.json());
app.use(cors());

app.use('/user', userRoutes);
app.use('/product', productRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('chatMessage', async ({ roomId, sender, message }) => {
    const chatMessage = new Chat({ roomId, sender, message });
    await chatMessage.save();
    io.to(roomId).emit('message', { sender, message });
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});