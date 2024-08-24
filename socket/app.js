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
let offlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId, lastSeen: new Date() });
    offlineUser = offlineUser.filter((user) => user.userId !== userId);
    console.log("Users online", onlineUser);
    console.log("Users offline", offlineUser);
    io.emit("userOnline", onlineUser);
    io.emit("usersOffline", offlineUser);
  } 
};

const removeUser = (socketId) => {
  const user = onlineUser.find((user) => user.socketId === socketId);
  if (user) {
    offlineUser.push({
      userId: user.userId,
      lastSeen: new Date().toISOString(),
    });
  };
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
  console.log("Users online", onlineUser);
  console.log("Users offline", offlineUser);
  io.emit("userOnline", onlineUser); 
  io.emit("usersOffline", offlineUser);
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
