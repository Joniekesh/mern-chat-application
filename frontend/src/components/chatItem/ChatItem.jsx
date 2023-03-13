import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsChat } from "../../redux/ChatRedux";
import { isOnline } from "../../utils/onlineUser";
import "./chatItem.scss";

const ChatItem = ({ chat, onlineUsers }) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const friend =
		!chat?.isGroupChat &&
		chat.members?.find((member) => member?._id !== currentUser?._id);

	const handleNavigate = () => {
		navigate(`/chats/${chat._id}`);
		dispatch(setIsChat(true));
	};

	const online = isOnline(onlineUsers, friend?._id);

	return (
		<div className="chatItem" onClick={handleNavigate}>
			<div className="chatItemTop">
				<div className="left">
					<img
						src={
							chat?.isGroupChat
								? chat?.chatImg
								: friend?.profilePic || "https://bit.ly/3VlFEBJ"
						}
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
			{chat?.latestMessage && (
				<>
					{chat.latestMessage?.text.length < 20 ? (
						<span className="chatItemBottom">{chat.latestMessage?.text}</span>
					) : (
						<span className="chatItemBottom">
							{chat?.latestMessage?.text.slice(0, 20)}...
						</span>
					)}
				</>
			)}
		</div>
	);
};

export default ChatItem;
