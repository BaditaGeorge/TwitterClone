const JWT = require("../utils/jwtUtils");
const authService = require("../services/auth");
const { setCookie, getCookie, deleteCookie } = require("../utils/cookieStore");

const publicEndpoints = ["/auth/signin", "/auth/signup"];
const logoutEndpoint = "/auth/signout";
const refreshEndpoint = "/auth/refresh";

const respondNotAuth = (res) => {
  res.statusCode = 401;
  res.json({
    message: "Not Authenticated! Please login!",
  });
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies["token"];

  //handle login and register
  if (publicEndpoints.find((el) => el === req.path)) {
    req.cookieStore = {
      set: setCookie,
    };
    return next();
  }

  //there is no token and request is not in publicEndpoints list
  // so we answer with 401 (Unauthorized)
  if (!token) {
    return respondNotAuth(res);
  }

  // we check if token is expired
  const isTokenExpired = JWT.checkIfTokenExpired(token);

  // token exists, we get user binded by the token
  // we set this here because of the /refresh endpoint that is called down bellow, when token might be expired already
  // however, is fine, because this has a small cost, so no hard loading
  const userID = getCookie(token);
  req.userID = userID;

  // if is expired, then unauthorized response
  if (isTokenExpired === null) {
    if (req.path === refreshEndpoint) {
      return next();
    } else {
      return respondNotAuth(res);
    }
  }

  // there is no user, so this might not be a valid token or might be from a previous session
  if (!userID) {
    return respondNotAuth(res);
  }

  // if we're trying to logout the user, we won't fallback to refresh token or other checks
  // we know that token is still valid, so we'll just go ahead and logout the user
  if (req.path === logoutEndpoint) {
    deleteCookie(token);
    return next();
  }

  // if token is expired , we refresh it before going futher
  // this isTokenExpired does mean that token will expired in 10 seconds or less, so we refresh it
  // if token is already expired, isTokenExpired will be null, and we'll return Unauthorized
  // name isTokenExpired is fine, because in last 10 seconds, we consider that the token is almost expired
  // but is still valid so we can refresh it
  if (isTokenExpired) {
    deleteCookie(token);
    authService
      .refreshAuthentication(userID, token)
      .then((token) => {
        setCookie(token, userID);
        res.cookie("token", token);
        next();
      })
      .catch((err) => {
        res.statusCode = 400;
        res.json({ message: err.message });
      });
  } else {
    next();
  }
};

module.exports = authMiddleware;
