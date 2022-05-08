const express = require("express");
const produceSHA512 = require("../utils/produceSHA512");
const authService = require("../services/auth");
const config = require("../config");
const cookieExpireTime = config.jwtExpiryTimeSeconds;

const UserModel = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signin", (req, res) => {
  const loginData = {
    email: req.body.email,
    password: produceSHA512(req.body.password),
  };

  authService
    .loginUser(loginData)
    .then((userData) => {
      res.cookie("token", userData["token"], {
        httpOnly: true,
        maxAge: cookieExpireTime * 1000,
      });
      req.cookieStore.set(userData["token"], userData["id"]);
      res.json(userData);
    })
    .catch((err) => {
      res.statusCode = err.status;
      res.json({ message: err.message });
    });
});

authRouter.post("/signup", (req, res) => {
  const userData = {
    ...req.body,
    password: produceSHA512(req.body.password),
  };

  new UserModel(userData).save((err, data) => {
    if (err) {
      res.statusCode = 400;
      res.json({ message: err.message });
    } else {
      res.json(data);
    }
  });
});

authRouter.post("/signout", (req, res) => {
  const userID = req.userID;

  authService
    .logoutUser(userID, req.cookies["token"])
    .then(() => {
      res.clearCookie("token");
      res.json({});
    })
    .catch((err) => {
      res.statusCode = err.status;
      res.json({ message: err.message });
    });
});

authRouter.post("/refresh", (req, res) => {
  const userID = req.userID;
  const oldToken = req.body["token"];

  authService
    .retrieveRefreshedToken(userID, oldToken)
    .then((refreshedToken) => {
      res.json({
        token: refreshedToken,
      });
    })
    .catch((err) => {
      res.statusCode = err.status;
      res.json({ message: err.message });
    });
});

authRouter.get("/user", (req, res) => {
  UserModel.findOne({ email: "miki1@gmail.com" }, (err, data) => {
    res.json(data);
  });
});

module.exports = authRouter;
