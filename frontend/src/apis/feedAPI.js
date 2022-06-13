import axios from "axios";
import { processAxiosPromise } from "../utils";

const BASE_URL = "http://localhost:5050/feed";

const FeedAPI = {
  createChirp: function (chirpData) {
    return processAxiosPromise(
      axios.post(`${BASE_URL}/chirp`, chirpData, { withCredentials: true })
    );
  },
  loadFeed: function (page) {
    return processAxiosPromise(
      axios.get(`${BASE_URL}?page=${page}`, { withCredentials: true })
    );
  },
  likeChirp: function (chirpID) {
    return processAxiosPromise(
      axios.post(`${BASE_URL}/like/${chirpID}`, {}, { withCredentials: true })
    );
  },
  removeLike: function (chirpID) {
    return processAxiosPromise(
      axios.post(
        `${BASE_URL}/like/remove/${chirpID}`,
        {},
        { withCredentials: true }
      )
    );
  },
  commentChirp: function (chirpID, commentContent, userName, userAvatar) {
    return processAxiosPromise(
      axios.post(
        `${BASE_URL}/comment/${chirpID}`,
        { text: commentContent, userName: userName, userAvatar: userAvatar },
        { withCredentials: true }
      )
    );
  },
  createFollow: function (followeeID) {
    return processAxiosPromise(
      axios.post(
        `${BASE_URL}/follow/${followeeID}`,
        {},
        { withCredentials: true }
      )
    );
  },
  removeFollow: function (followeeID) {
    return processAxiosPromise(
      axios.post(
        `${BASE_URL}/unfollow/${followeeID}`,
        {},
        { withCredentials: true }
      )
    );
  },
};

export default FeedAPI;
