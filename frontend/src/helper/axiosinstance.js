import axios from "axios";
import { baseUrl } from "../constants";
const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = baseUrl;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;

// import axios from "axios";
// import { baseUrl } from "../cosntants";

// // Create axios instance
// const axiosInstance = axios.create({
//   baseURL: baseUrl,
// });

// // Request interceptor to attach Authorization header
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;



//dont publish this code 