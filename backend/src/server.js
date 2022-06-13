const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth");

const mongoose = require("mongoose");

const authRouter = require("./controllers/auth");
const feedRouter = require("./controllers/feed");
const PORT = 5050;

const server = express();

server.use(express.static('files', {}));
server.use(cookieParser());
server.use(express.json({ limit: '50mb' }));
server.use(
  express.urlencoded({
    extended: true,
  })
);


// this are needed because middlewares do not catch options request
server.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  res.end();
});

// middleware to set headers
server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});
server.use(authMiddleware);

const mongoURL = "mongodb://localhost:27017/chirpper";
mongoose
  .connect(mongoURL)
  .then(() => {
    server.use("/auth", authRouter);
    server.use("/feed", feedRouter);

    server.listen(PORT, () => {
      console.log(`Twitter Clone App listening at http://localhost:${PORT}`);
    });
  });
