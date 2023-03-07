import "./home.scss";
import Chats from "../../components/chats/Chats";
import { useState } from "react";
import Welcome from "../../components/welcome/Welcome";
import UserList from "../../components/userList/UserList";
import ChatRoomModal from "../../components/chatRoomModal/ChatRoomModal";
import Profile from "../../components/profile/Profile";

const Home = () => {
	const [isSearch, setIsSearch] = useState(false);
	const [openRoom, setOpenRoom] = useState(false);
	const [isProfile, setIsProfile] = useState(false);

	return (
		<>
			<div className="home">
				<Chats />
				<Welcome />
				{isSearch && <UserList setIsSearch={setIsSearch} />}
				{openRoom && <ChatRoomModal setOpenRoom={setOpenRoom} />}
				{isProfile && <Profile setIsProfile={setIsProfile} />}
			</div>
		</>
	);
};

export default Home;
