import axios from "axios";
import { dbUrl } from "./constants";
const API = axios.create({ baseURL:  dbUrl});
if (
  typeof localStorage != "undefined" &&
  localStorage.getItem("tuned-token")
) {
  const token = localStorage.getItem("tuned-token");
  API.interceptors.request.use((req) => {
    req.headers.authorization = `Bearer ${token}`;
    return req;
  });
}

const post = (url, fd ) => {
  return API.post(url, fd);
};
const get = (url) => {
  return API.get(url);
};


export { post, get };
