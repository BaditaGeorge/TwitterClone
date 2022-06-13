import logo from "./logo.svg";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { useIsLoggedIn } from "./hooks";

import LoginForm from "./components/loginForm/loginForm";
import RegisterForm from "./components/registerForm/registerForm";
import LandingPage from "./components/landing/landingPage";
import HomePage from "./components/home/homePage";
import FeedPage from "./components/feed/feedPage";

import "./App.css";
import LoadingSpinner from "./components/loading/loadingSpinner";
import { useEffect, useState } from "react";
import { isJwtExpired } from "jwt-check-expiration";
import { AuthAPI } from "./apis";
import { RecoilRoot, useRecoilState } from "recoil";
import { userProfileState } from "./state/atoms";

const TokenState = Object.freeze({
  EXPIRED: "expired", // when token is expired
  VALID: "valid", //when token is present and not expired, we'll call it valid
  NONE: "none", // when token is null/undefined
});

const getTokenState = () => {
  let token = localStorage.getItem("token");
  if (token) {
    return isJwtExpired(token) ? TokenState.EXPIRED : TokenState.VALID;
  } else {
    return TokenState.NONE;
  }
};

function ProtectedRoute({ children, showLoader }) {
  const isLoggedIn = useIsLoggedIn();

  // we'll return a loader if request for retrieving refreshed token is too long
  if (showLoader) {
    return <LoadingSpinner />;
  }

  return isLoggedIn ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  const isLoggedIn = useIsLoggedIn();
  return !isLoggedIn ? children : <Navigate to="/feed" />;
}

function App() {
  const tokenState = getTokenState();
  const [showLoader, setShowLoader] = useState(false);
  const [_, setProfile] = useRecoilState(userProfileState);

  useEffect(() => {
    if (tokenState === TokenState.EXPIRED && !showLoader) {
      setShowLoader(true);
      AuthAPI.refreshToken().then(([status, data]) => {
        if (status >= 400) {
          localStorage.removeItem("token");
        } else {
          localStorage.setItem("token", data["token"]);
        }
        setShowLoader(false);
      });
    } else {
      AuthAPI.getUser().then(([status, data]) => {
        if (status >= 400) {
          localStorage.removeItem("token");
        } else {
          setProfile(data);
        }
      });
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute showLoader={showLoader}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute showLoader={showLoader}>
                <FeedPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
