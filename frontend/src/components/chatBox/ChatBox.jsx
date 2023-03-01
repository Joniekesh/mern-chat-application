import { useEffect, useRef, useState } from "react";
import "./chatBox.scss";
import { useDispatch, useSelector } from "react-redux";
import { createMessage, getMessages } from "../../redux/MessageApi";
import Loader from "../loader/Loader";
import { format } from "timeago.js";
import { BsCardImage } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsArrowLeftCircleFill, BsFillEyeFill } from "react-icons/bs";
import ChatRoomModal from "../../components/chatRoomModal/ChatRoomModal";

import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { isOnline } from "../../utils/onlineUser";

const ChatBox = ({ chat, onlineUsers }) => {
	const [text, setText] = useState("");
	const [file, setFile] = useState("");
	const [isDelete, setIsDelete] = useState(false);
	const [openRoom, setOpenRoom] = useState(false);

	const scrollRef = useRef();

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const friend =
		!chat?.isGroupChat &&
		chat?.members.find((member) => member._id !== currentUser._id);

	const { messages, loading } = useSelector((state) => state.message);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
	}, [messages]);

	useEffect(() => {
		dispatch(getMessages(chat?._id));
	}, [dispatch, chat?._id]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append("file", file);

		const uploadRes = await axiosInstance.post("/upload", data);
		const url = uploadRes.data;

		dispatch(
			createMessage({
				sender: currentUser._id,
				chat: chat._id,
				img: file ? url : "",
				text,
			})
		);
		dispatch(getMessages(chat._id));
		setText("");
		setFile("");
	};

	const handleNavigate = () => {
		navigate("/");
	};

	const online = isOnline(onlineUsers, friend?._id);

	return (
		<div className="chatBox">
			<div className="container">
				<div className="top">
					<div className="arrow">
						<span className="arrowItem" onClick={handleNavigate}>
							<BsArrowLeftCircleFill />
						</span>
						{chat && (
							<div className="imgDiv">
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
								? chat.chatName
								: friend.firstName + " " + friend.lastName}
						</h2>
					) : (
						<h2>Jonie Chat App</h2>
					)}
					{chat && (
						<span className="info" onClick={() => setOpenRoom(true)}>
							<BsFillEyeFill />
						</span>
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
									<p className="text">{message.text}</p>
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
