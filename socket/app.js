import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.CLIENT_URL;

const io = new Server({
  cors: {
    origin: url,
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId, lastSeen: new Date() });
    console.log("User added", onlineUser);
    io.emit("userOnline", onlineUser);
  } else {
    userExists.socketId = socketId;
    userExists.lastSeen = new Date();
    io.emit("userOnline", onlineUser); 
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
  io.emit("userOnline", onlineUser); 
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    socket.emit("userOnline", onlineUser); 
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.log("User not found");
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
  });
});

io.listen(4001);
