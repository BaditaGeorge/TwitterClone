const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth");
const socketIO = require("socket.io");
const SocketStore = require("./utils/socketStore");
const StreamStore = require("./utils/streamStore");

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
  server.use(
    "/streams",
    express.Router().get("/", (req, res) => {
      res.statusCode = 200;
      res.json(StreamStore.getRooms());
    })
  );

  const io = socketIO(
    server.listen(PORT, () => {
      console.log(`Twitter Clone App listening at http://localhost:${PORT}`);
    }),
    { cors: { origin: "*" } }
  );

  let peers = {};
  io.on("connection", (socket) => {
    let userID = null;
    let roomId = null;
    let peerId = null;
    // let stream = null;
    socket.on("postCreationBinding", (data) => {
      if (data && data.userID) {
        userID = data.userID;
        SocketStore.addSocket(data.userID, socket);
      }
    });
    socket.on("disconnect", () => {
      if (userID) {
        SocketStore.removeSocket(userID, socket.id);
      }
    });
    socket.on("join-room", (roomID, peerID, streamerName) => {
      socket.join(roomID);
      roomId = roomID;
      peerId = peerID;
      if (roomID !== peerID && peers[roomID]) {
        peers[roomID].emit("user-connected", peerID);
      } else {
        StreamStore.addRoom(roomID, streamerName);
        peers[roomID] = socket;
      }
    });
    socket.on("on-chat-send", (chatMsg) => {
      socket.to(roomId).emit("on-chat-recv", chatMsg);
    });
    socket.on("stream-stop", (roomID) => {
      console.log("Stream should stop?");
      StreamStore.removeRoom(roomID);
    });
    socket.on("close", () => {
      console.log("close");
    });
    socket.on("disconnect", () => {
      console.log("disconnect");
      console.log(roomId);
      console.log(peerId);
      if (peerId && roomId && peerId === roomId) {
        StreamStore.removeRoom(roomId);
      }
    });
  });
});
