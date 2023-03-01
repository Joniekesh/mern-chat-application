import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: "https://mern-chat-app-7njr.onrender.com/api",
});
