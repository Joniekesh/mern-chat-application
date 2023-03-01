import "./chats.scss";
import { BsPlusSquareFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import CreateChat from "../createChat/CreateChat";
import Loader from "../loader/Loader";
import ChatItem from "../chatItem/ChatItem";
import { BiSearch } from "react-icons/bi";
import UserList from "../userList/UserList";
import { getChats } from "../../redux/ChatApi";
import { useDispatch, useSelector } from "react-redux";

const Chats = ({ onlineUsers }) => {
	const [open, setOpen] = useState(false);
	const [openUserSearch, setOpenUserSearch] = useState(false);

	const { chats, loading } = useSelector((state) => state.chat);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getChats());
	}, [dispatch]);

	return (
		<div className="chats">
			<div className="container">
				<div className="top">
					<div className="userSearch" onClick={() => setOpenUserSearch(true)}>
						<div className="inpuContainer">
							<BiSearch style={{ fontWeight: "bold", fontSize: "24px" }} />
							<input type="text" placeholder="Search User" disabled />
						</div>
					</div>
					<div className="middle">
						<span className="title">My Chats</span>
						<div className="btn" onClick={() => setOpen(true)}>
							<span>New Chat</span>
							<BsPlusSquareFill />
						</div>
					</div>
				</div>
				{chats?.length > 0 && loading ? (
					<Loader />
				) : chats?.length > 0 ? (
					<div className="bottom">
						{chats
							.map((chat) => (
								<ChatItem
									chat={chat}
									onlineUsers={onlineUsers}
									key={chat._id}
								/>
							))
							.reverse()}
					</div>
				) : (
					<span className="noChats">No Chats yet!</span>
				)}
			</div>
			{open && <CreateChat setOpen={setOpen} />}
			{openUserSearch && <UserList setOpenUserSearch={setOpenUserSearch} />}
		</div>
	);
};

export default Chats;
