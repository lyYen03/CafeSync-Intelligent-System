import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // đổi nếu backend khác port
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;