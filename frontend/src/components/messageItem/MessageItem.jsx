import "./messageItem.scss";
import { format } from "timeago.js";
import { FaEllipsisV } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage, getMessages } from "../../redux/MessageApi";
import { useNavigate } from "react-router-dom";
import { setIsChat } from "../../redux/ChatRedux";
import axios from "axios";
import { axiosInstance } from "../../utils/axiosInstance";

const MessageItem = ({ message, chat, socket }) => {
	const [isDelete, setIsDelete] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { currentUser: user } = useSelector((state) => state.auth);

	const config = {
		headers: {
			Authorization: `Bearer ${user?.token}`,
		},
	};

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const isValidHttpUrl = (string) => {
		let url;
		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}
		return url.protocol === "http:" || url.protocol === "https:";
	};

	const handleDelete = (id) => {
		dispatch(deleteMessage(id));
		dispatch(getMessages(chat._id));
		setIsDelete(false);
	};

	const joinChat = async (url) => {
		const id = url.split("/")[4];

		try {
			const res = await axiosInstance.put(
				`/chats/${id}`,
				{
					userId: currentUser._id,
				},
				config
			);
			console.log(res.data, id);
			if (res.status === 200) {
				navigate(`/chats/${res.data._id}`);
				socket?.emit("joinChat", {
					room: res.data._id,
					userId: currentUser._id,
				});

				dispatch(setIsChat(true));
			}
		} catch (err) {
			console.log(err.response.data);
		}
	};

	return (
		<div
			className={
				currentUser?._id === message.sender?._id
					? "messageItem current"
					: "messageItem"
			}
		>
			{message.img && <img src={message.img} alt="" />}
			{chat?.isGroupChat && message.sender?._id !== currentUser?._id && (
				<span className="messengerName">
					{message.sender.firstName + " " + message.sender.lastName}
				</span>
			)}
			{message.text && isValidHttpUrl(message.text) ? (
				<a
					style={{ color: "white" }}
					href={message.text}
					onClick={() => joinChat(message.text)}
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
				<span className="ellipsis" onClick={() => setIsDelete(!isDelete)}>
					<FaEllipsisV />
				</span>
			)}
			{isDelete && (
				<div className="remove">
					<span className="del">Delete </span>
					<span className="icon" onClick={() => handleDelete(message._id)}>
						<RiDeleteBin6Line />
					</span>
				</div>
			)}
		</div>
	);
};

export default MessageItem;
