import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ChatRoomModal from "../../components/chatRoomModal/ChatRoomModal";
import Chats from "../../components/chats/Chats";
import Profile from "../../components/profile/Profile";
import RightBar from "../../components/rightBar/RightBar";
import UserList from "../../components/userList/UserList";
import { getChatById } from "../../redux/ChatApi";
import "./singleChat.scss";

import Loader from "../../components/loader/Loader";
import { BsCardImage } from "react-icons/bs";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { isOnline } from "../../utils/onlineUser";
import { createMessage, getMessages } from "../../redux/MessageApi";
import axios from "axios";
import MessageItem from "../../components/messageItem/MessageItem";
import { setIsChat } from "../../redux/ChatRedux";

const SingleChat = ({ onlineUsers, socket }) => {
	const [isSearch, setIsSearch] = useState(false);
	const [openRoom, setOpenRoom] = useState(false);
	const [isProfile, setIsProfile] = useState(false);

	const scrollRef = useRef();
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [text, setText] = useState("");
	const [file, setFile] = useState("");
	const [arrivalMessage, setArrivalMessage] = useState(null);
	// const [openRoom, setOpenRoom] = useState(false);

	const { chat, isChat } = useSelector((state) => state.chat);
	const { currentUser: user } = useSelector((state) => state.auth);

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const friend =
		!chat?.isGroupChat &&
		chat?.members.find((member) => member?._id !== currentUser?._id);

	const { messages, message, loading } = useSelector((state) => state.message);

	const config = {
		headers: {
			Authorization: `Bearer ${user?.token}`,
		},
	};

	useEffect(() => {
		socket?.on("receiveMessage", (data) => {
			setArrivalMessage(data);
		});
	}, []);

	useEffect(() => {
		dispatch(getChatById(id));
		dispatch(getMessages(id));
	}, [dispatch, id]);

	useEffect(() => {
		arrivalMessage &&
			chat.members.includes(arrivalMessage.message?.sender) &&
			dispatch(getMessages(id));
		// socket?.emit("joinChat", { room: chat?._id, userId: currentUser._id });
	}, [dispatch, id]);

	// console.log(arrivalMessage);

	useEffect(() => {
		socket?.emit("joinChat", { room: chat?._id, userId: currentUser._id });
	}, [socket, chat?._id, currentUser._id]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
	}, [messages]);

	const [width, setWidth] = useState(window.innerWidth);
	const [height, setHeight] = useState(window.innerHeight);

	const updateDimensions = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	};
	useEffect(() => {
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	const mobile = width <= 600;

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (file) {
			const data = new FormData();
			data.append("file", file);
			data.append("upload_preset", "upload");

			const uploadRes = await axios.post(
				"https://api.cloudinary.com/v1_1/joniekesh/image/upload",
				data
			);

			const { url } = uploadRes.data;

			const newMessage = {
				sender: currentUser._id,
				chat: chat._id,
				img: file ? url : "",
				text,
			};
			dispatch(createMessage(newMessage));
			dispatch(getMessages(id));
			socket?.emit("addMessage", { message, chat });
		} else {
			const newMessage = {
				sender: currentUser._id,
				chat: chat._id,
				text,
			};
			dispatch(createMessage(newMessage));
			dispatch(getMessages(id));
			socket?.emit("addMessage", { message, chat });
		}

		setText("");
		setFile("");
	};

	const handleNavigate = () => {
		navigate("/");
		dispatch(setIsChat(false));
	};

	const leaveChat = async (chatId) => {
		try {
			const res = await axiosInstance.put(
				`/chats/${chatId}/leave`,
				{
					userId: currentUser._id,
				},
				config
			);
			if (res.status === 200) {
				toast.success(res.data, { theme: "colored" });
				navigate("/");
				dispatch(setIsChat(false));
			}
		} catch (err) {
			toast.error(err.response.data, { theme: "colored" });
		}
	};

	const online = isOnline(onlineUsers, friend?._id);

	return (
		<div>
			<div className="singleChat">
				<Chats onlineUsers={onlineUsers} socket={socket} />

				<div
					style={{ display: mobile && (isChat ? "block" : "none") }}
					className="chatBox"
				>
					<div className="container">
						<div className="top">
							<div className="arrow">
								<span className="arrowItem" onClick={handleNavigate}>
									<BsArrowLeftCircleFill />
								</span>
								{chat && (
									<div className="imgDiv" onClick={() => setOpenRoom(true)}>
										<img
											src={
												chat?.isGroupChat
													? chat.chatImg
													: friend?.profilePic || "https://bit.ly/3VlFEBJ"
											}
											alt=""
										/>
										{online && <span className="online"></span>}
									</div>
								)}
							</div>
							{chat ? (
								<h2>
									{chat?.isGroupChat
										? chat?.chatName.slice(0, 12)
										: friend?.firstName + " " + friend?.lastName}
								</h2>
							) : (
								<h2>Jonie Chat App</h2>
							)}
							{chat?.isGroupChat && (
								<button className="leave" onClick={() => leaveChat(chat._id)}>
									Leave
								</button>
							)}
						</div>

						<div className="center">
							{messages.length > 0 ? (
								<div className="messages">
									{messages.map((message, key) => (
										<MessageItem
											message={message}
											chat={chat}
											key={key}
											socket={socket}
										/>
									))}
									<div ref={scrollRef}></div>
								</div>
							) : (
								<span className="empty">No messages yet!</span>
							)}
						</div>

						<div className="bottom">
							<form onSubmit={handleSubmit}>
								<textarea
									type="text"
									value={text}
									onChange={(e) => setText(e.target.value)}
								></textarea>
								<div className="actions">
									<label htmlFor="fileInput">
										<span>
											<BsCardImage />
										</span>
										<input
											type="file"
											id="fileInput"
											style={{ display: "none" }}
											onChange={(e) => setFile(e.target.files[0])}
										/>
									</label>
									<button type="submit">{loading ? <Loader /> : "SEND"}</button>
								</div>
							</form>
						</div>
					</div>
					{openRoom && (
						<ChatRoomModal
							chat={chat}
							setOpenRoom={setOpenRoom}
							onlineUsers={onlineUsers}
						/>
					)}
				</div>
				<RightBar chat={chat} chatId={chat?._id} onlineUsers={onlineUsers} />

				{isSearch && <UserList setIsSearch={setIsSearch} />}
				{openRoom && (
					<ChatRoomModal
						setOpenRoom={setOpenRoom}
						chat={chat}
						onlineUsers={onlineUsers}
					/>
				)}
				{isProfile && <Profile setIsProfile={setIsProfile} />}
			</div>
		</div>
	);
};

export default SingleChat;
