import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "http://localhost:5000/api",
});

// baseURL: "https://mern-chat-app-7njr.onrender.com/api",
