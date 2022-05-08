import axios from "axios";
import { processAxiosPromise } from "../utils";

const BASE_URL = "http://localhost:5050/auth";
const AuthAPI = {
  registerUser: function (userData) {
    return processAxiosPromise(
      axios.post(`${BASE_URL}/signup`, {
        email: userData["email"],
        password: userData["password"],
        name: `${userData["lastName"]} ${userData["firstName"]}`,
      })
    );
  },
  loginUser: function (userData) {
    return processAxiosPromise(
      axios.post(`${BASE_URL}/signin`, userData, { withCredentials: true })
    );
  },
  logoutUser: function () {
    return processAxiosPromise(
      axios.post(`${BASE_URL}/signout`, {}, { withCredentials: true })
    );
  },
  refreshToken: function () {
    return processAxiosPromise(
      axios.post(
        `${BASE_URL}/refresh`,
        { token: localStorage.getItem("token") },
        { withCredentials: true }
      )
    );
  },
  getUser: function () {
    return processAxiosPromise(
      axios.get(`${BASE_URL}/user`, { withCredentials: true })
    );
  },
};

export default AuthAPI;
