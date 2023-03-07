import { useEffect, useRef, useState } from "react";
import "./chatBox.scss";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, getMessages } from "../../redux/MessageApi";
import Loader from "../loader/Loader";
import { format } from "timeago.js";
import { BsCardImage } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import ChatRoomModal from "../../components/chatRoomModal/ChatRoomModal";
import { toast } from "react-toastify";

import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { isOnline } from "../../utils/onlineUser";

const ChatBox = ({ chat, onlineUsers, isChat, setIsChat, socket }) => {
	const [text, setText] = useState("");
	const [file, setFile] = useState("");
	const [isDelete, setIsDelete] = useState(false);
	const [openRoom, setOpenRoom] = useState(false);
	const [message, setMessage] = useState(null);

	const scrollRef = useRef();

	const { currentUser: user } = useSelector((state) => state.auth);

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const friend =
		!chat?.isGroupChat &&
		chat?.members.find((member) => member?._id !== currentUser?._id);

	const { messages, loading } = useSelector((state) => state.message);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
	}, [messages]);

	useEffect(() => {
		dispatch(getMessages(chat?._id));
	}, [dispatch, chat?._id]);

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

		const data = new FormData();
		data.append("file", file);

		const uploadRes = await axiosInstance.post("/upload", data);
		const url = uploadRes.data;

		const newMessage = {
			sender: currentUser._id,
			chat: chat._id,
			img: file ? url : "",
			text,
		};

		dispatch(createMessage(newMessage));
		dispatch(getMessages(chat._id));
		setText("");
		setFile("");

		socket.emit("sendMessage", { newMessage, receiver: friend });
	};

	useEffect(() => {
		socket?.on("receiveMessage", (newMessage) => {
			setMessage(newMessage);
		});
	}, []);

	console.log(message);

	const handleNavigate = () => {
		navigate("/");
		setIsChat(false);
	};

	const isValidHttpUrl = (string) => {
		let url;
		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}
		return url.protocol === "http:" || url.protocol === "https:";
	};

	const config = {
		headers: {
			Authorization: `Bearer ${user?.token}`,
		},
	};

	const joinChat = async (chat) => {
		try {
			const res = await axiosInstance.put(
				`/chats/${chat}`,
				{
					members: currentUser._id,
				},
				config
			);

			console.log(res.data);
		} catch (err) {
			console.log(err.response.data);
		}
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
			}
		} catch (err) {
			toast.error(err.response.data, { theme: "colored" });
		}
	};

	const online = isOnline(onlineUsers, friend?._id);

	return (
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
									src={chat?.isGroupChat ? chat.chatImg : friend?.profilePic}
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
							{messages.map((message) => (
								<div
									key={message._id}
									className={
										currentUser?._id === message.sender?._id
											? "messageItem current"
											: "messageItem"
									}
								>
									{message.img && <img src={"/assets/" + message.img} alt="" />}
									{chat?.isGroupChat &&
										message.sender?._id !== currentUser?._id && (
											<span className="messengerName">
												{message.sender.firstName +
													" " +
													message.sender.lastName}
											</span>
										)}
									{message.text && isValidHttpUrl(message.text) ? (
										<a
											href={message.text}
											onClick={() => joinChat(message.chat)}
										>
											<p className="text">
												{message.text.substring(0, 27)}
												<br></br>
												{message.text.substring(27)}
											</p>
										</a>
									) : (
										<p className="text">{message.text}</p>
									)}
									<span className="time">{format(message.createdAt)}</span>
									{message.sender?._id === currentUser?._id && (
										<span
											className="ellipsis"
											onClick={() => setIsDelete(!isDelete)}
										>
											<FaEllipsisV />
										</span>
									)}
									{isDelete && (
										<div className="remove">
											<span className="del">Delete </span>
											<span className="icon">
												<RiDeleteBin6Line />
											</span>
										</div>
									)}
								</div>
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
	);
};

export default ChatBox;
