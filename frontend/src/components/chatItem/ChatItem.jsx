import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isOnline } from "../../utils/onlineUser";
import "./chatItem.scss";

const ChatItem = ({ chat, onlineUsers }) => {
	const [active, setActive] = useState(null);
	const navigate = useNavigate();

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const friend =
		!chat?.isGroupChat &&
		chat.members?.find((member) => member?._id !== currentUser?._id);

	const handleNavigate = () => {
		navigate(`/chats/${chat._id}`);
	};

	const online = isOnline(onlineUsers, friend?._id);

	return (
		<div className="chatItem" onClick={() => handleNavigate()}>
			<div className="chatItemTop">
				<div className="left">
					<img
						src={chat?.isGroupChat ? chat?.chatImg : friend?.profilePic}
						alt=""
					/>
					{online && <span className="online"></span>}
				</div>
				<span className="right">
					{chat?.isGroupChat
						? chat?.chatName
						: friend?.firstName + " " + friend?.lastName}
				</span>
			</div>
			<span className="chatItemBottom">Hello...</span>
		</div>
	);
};

export default ChatItem;
