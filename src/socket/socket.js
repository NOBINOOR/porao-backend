const { Server } = require('socket.io');

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
}

const userSocketMap = {}; // {userId->socketId}

const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    if (userId !== undefined) {
      userSocketMap[userId] = socket.id;
    } 

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    })
  });

  return io;
}

module.exports = { createSocketServer, getReceiverSocketId };