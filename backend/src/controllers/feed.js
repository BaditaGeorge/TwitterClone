const express = require("express");
const feedService = require("../services/feed");
const fileProcessorMiddleware = require("../middlewares/filesProcessor");

const feedRouter = express.Router();

feedRouter.post("/chirp", fileProcessorMiddleware, (req, res) => {
  const chirpData = {
    ...req.body,
    ownerID: req.userID,
  };

  feedService
    .createChirp(chirpData)
    .then((data) => {
      res.statusCode = 200;
      res.json(data);
    })
    .catch((err) => {
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

feedRouter.post("/like/:postID", (req, res) => {
  feedService
    .likeChirp(req.params["postID"], req.userID)
    .then((data) => {
      res.statusCode = 200;
      res.json(data);
    })
    .catch((err) => {
      res.statusCode = 400;
      res.json({ message: err.message });
    });
});

feedRouter.post("/like/remove/:postID", (req, res) => {
  feedService
    .removeLike(req.params["postID"], req.userID)
    .then((data) => {
      res.statusCode = 200;
      res.json(data);
    })
    .catch((err) => {
      res.statusCode = 400;
      res.json({ message: err.message });
    });
});

feedRouter.post("/comment/:postID", (req, res) => {
  feedService
    .commentChirp(
      req.params["postID"],
      req.userID,
      req.body.text,
      req.body.userName,
      req.body.userAvatar
    )
    .then((data) => {
      res.statusCode = 200;
      res.json(data);
    })
    .catch((err) => {
      res.statusCode = 400;
      res.json({ message: err.message });
    });
});

feedRouter.delete("/comment/:postID", (req, res) => {});

feedRouter.post("/follow/:followeeID", (req, res) => {
  feedService
    .createFollow(req.userID, req.params["followeeID"])
    .then((data) => {
      res.statusCode = 200;
      res.json(data);
    })
    .catch((err) => {
      res.statusCode = 400;
      res.json({ message: err.message });
    });
});

feedRouter.post("/unfollow/:followeeID", (req, res) => {
  feedService
    .removeFollow(req.userID, req.params["followeeID"])
    .then((data) => {
      res.statusCode = 200;
      res.json(data);
    })
    .catch((err) => {
      res.statusCode = 400;
      res.json({ message: err.message });
    });
});

module.exports = feedRouter;
