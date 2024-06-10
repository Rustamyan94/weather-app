import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_URL}/data/2.5/`,
  headers: {
    Accept: "/",
    "Content-Type": "application/json; charset=utf-8",
  },
  mode: "no-cors",
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.warn("axiosInstance error", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
