import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config({path: "../.env"});

const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
    const userExits = onlineUser.find((user) => user.userId === userId);
    if (!userExits) {
      onlineUser.push({ userId, socketId });
    }
};

const removeUser = (socketId) => {
  return onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
 
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (!receiver) {
      return console.log("User not found");
    }
    io.to(receiver.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(4001);
