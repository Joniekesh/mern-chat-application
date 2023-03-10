import "./App.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import Home from "./pages/home/Home";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, loadUser } from "./redux/UserApi";
import { io } from "socket.io-client";
import SingleChat from "./pages/singleChat/SingleChat";
import { getChats } from "./redux/ChatApi";
import ResetPassword from "./pages/resetPassword/ResetPassword";

var socket;
const ENDPOINT = "https://mern-chat-app-7njr.onrender.com";

// const ENDPOINT = "http://localhost:5000";
const App = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getChats());
	}, [dispatch]);

	const [onlineUsers, setOnlineUsers] = useState([]);

	const { currentUser } = useSelector((state) => state.auth);
	const loggedinUser = currentUser?.user;

	const { userInfo } = useSelector((state) => state.user);
	const user = userInfo?.user;
	const userId = user?._id;

	const PrivateRoute = ({ children }) => {
		return loggedinUser ? children : <Navigate to="/signin" />;
	};

	useEffect(() => {
		dispatch(loadUser());
		dispatch(getUsers());
	}, [loggedinUser]);

	useEffect(() => {
		socket = io(ENDPOINT);

		socket.emit("addUser", userId);
	}, [ENDPOINT]);

	useEffect(() => {
		socket.on("onlineUsers", (onlineUsers) => {
			setOnlineUsers(onlineUsers);
		});
	}, []);

	return (
		<div className="app">
			<div>
				<ToastContainer />
			</div>
			<Router>
				<Routes>
					<Route
						exact
						path="/chats/:id"
						element={
							<PrivateRoute>
								<SingleChat onlineUsers={onlineUsers} socket={socket} />
							</PrivateRoute>
						}
					></Route>
					<Route
						exact
						path="/"
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}
					></Route>

					<Route
						path="/signup"
						element={loggedinUser ? <Home /> : <SignUp />}
					></Route>
					<Route
						path="/signin"
						element={loggedinUser ? <Home /> : <SignIn />}
					></Route>
					<Route path="/forgotpassword" element={<ForgotPassword />}></Route>
					<Route
						path="/passwordreset/:resetToken"
						element={<ResetPassword />}
					></Route>
				</Routes>
			</Router>
		</div>
	);
};

export default App;
