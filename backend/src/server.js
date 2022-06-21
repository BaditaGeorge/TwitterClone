const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth");
const socketIO = require("socket.io");
const SocketStore = require("./utils/socketStore");

const mongoose = require("mongoose");

const authRouter = require("./controllers/auth");
const feedRouter = require("./controllers/feed");
const PORT = 5050;

const server = express();

server.use(express.static("files", {}));
server.use(cookieParser());
server.use(express.json({ limit: "50mb" }));
server.use(
  express.urlencoded({
    extended: true,
  })
);

// this are needed because middlewares do not catch options request
server.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.end();
});

// middleware to set headers
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});
server.use(authMiddleware);

const mongoURL = "mongodb://localhost:27017/chirpper";
mongoose.connect(mongoURL).then(() => {
  server.use("/auth", authRouter);
  server.use("/feed", feedRouter);

  const io = socketIO(
    server.listen(PORT, () => {
      console.log(`Twitter Clone App listening at http://localhost:${PORT}`);
    }),
    { cors: { origin: "*" } }
  );

  io.on("connection", (socket) => {
    let userID = null;
    socket.on("postCreationBinding", (data)=>{
      if(data && data.userID) {
        userID = data.userID;
        SocketStore.addSocket(data.userID, socket);
      }
    });
    socket.on("disconnect", () => {
      if(userID) {
        SocketStore.removeSocket(userID, socket.id);
      }
    });
  });
});
