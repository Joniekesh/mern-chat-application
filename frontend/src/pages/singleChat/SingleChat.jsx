import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ChatBox from "../../components/chatBox/ChatBox";
import ChatRoomModal from "../../components/chatRoomModal/ChatRoomModal";
import Chats from "../../components/chats/Chats";
import Profile from "../../components/profile/Profile";
import RightBar from "../../components/rightBar/RightBar";
import UserList from "../../components/userList/UserList";
import { getChatById } from "../../redux/ChatApi";
import "./singleChat.scss";

const SingleChat = ({ onlineUsers, socket }) => {
	const [isSearch, setIsSearch] = useState(false);
	const [openRoom, setOpenRoom] = useState(false);
	const [isProfile, setIsProfile] = useState(false);

	const { id } = useParams();
	const dispatch = useDispatch();

	const { chat } = useSelector((state) => state.chat);

	useEffect(() => {
		dispatch(getChatById(id));
	}, [dispatch, id]);

	return (
		<div>
			<div className="singleChat">
				<Chats onlineUsers={onlineUsers} />

				<ChatBox chat={chat} onlineUsers={onlineUsers} socket={socket} />
				<RightBar chat={chat} onlineUsers={onlineUsers} />

				{isSearch && <UserList setIsSearch={setIsSearch} />}
				{openRoom && <ChatRoomModal setOpenRoom={setOpenRoom} />}
				{isProfile && <Profile setIsProfile={setIsProfile} />}
			</div>
		</div>
	);
};

export default SingleChat;
