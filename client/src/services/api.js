import axios from "axios";

const API = axios.create({
  baseURL: "https://quickbite-api-3ptx.onrender.com/api",
});

export default API;
