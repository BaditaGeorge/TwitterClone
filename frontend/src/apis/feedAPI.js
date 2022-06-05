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
  }
};

export default FeedAPI;
