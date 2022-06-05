const express = require("express");
const feedService = require("../services/feed");
const fileProcessorMiddleware = require("../middlewares/filesProcessor");

const feedRouter = express.Router();

feedRouter.post("/chirp", fileProcessorMiddleware, (req, res) => {
  const chirpData = {
    ...req.body,
    ownerID: req.userID,
  };

  feedService.createChirp(chirpData).then((data) => {
      res.statusCode = 200;
      res.json(data);
  }).catch((err) => {
      res.statusCode = err.status;
      res.json({ message: err.message });
  });
});

feedRouter.get("/", (req, res) => {
  feedService
    .retrieveChirps(req.userID, req.query.page)
    .then((data) => {
      res.statusCode = 200;
      res.json(data);
    })
    .catch((err) => {
      res.statusCode = err.status;
      res.json({ message: err.message });
    });
});

module.exports = feedRouter;
