import "./chats.scss";
import { BsFillBellFill, BsPlusSquareFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import CreateChat from "../createChat/CreateChat";
import Loader from "../loader/Loader";
import ChatItem from "../chatItem/ChatItem";
import { BiSearch } from "react-icons/bi";
import UserList from "../userList/UserList";
import { getChats } from "../../redux/ChatApi";
import { useDispatch, useSelector } from "react-redux";
import { FaEllipsisV } from "react-icons/fa";
import Profile from "../profile/Profile";
import { logout } from "../../redux/AuthRedux";
import { clearUser } from "../../redux/UserRedux";
import { clearChats } from "../../redux/ChatRedux";
import { clearMessages } from "../../redux/MessageRedux";

const Chats = ({ onlineUsers, isChat, setIsChat }) => {
	const [open, setOpen] = useState(false);
	const [openUserSearch, setOpenUserSearch] = useState(false);
	const [openNotification, setOpenNotification] = useState(false);
	const [openProfile, setOpenProfile] = useState(false);
	const [isProfile, setIsProfile] = useState(false);

	const { chats, loading } = useSelector((state) => state.chat);

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const dispatch = useDispatch();

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

	useEffect(() => {
		dispatch(getChats());
	}, [dispatch]);

	const handleLogout = () => {
		dispatch(logout());
		dispatch(clearUser());
		dispatch(clearChats());
		dispatch(clearMessages());
	};

	return (
		<div
			style={{ display: mobile && (isChat ? "none" : "block") }}
			className="chats"
		>
			<div className="container">
				<div className="top">
					<div className="appLogo">
						<h2>jonieChat</h2>
						<div
							className="notification"
							onClick={() => setOpenNotification(!openNotification)}
						>
							<BsFillBellFill style={{ fontSize: "16px" }} />
							<span className="nCount">9</span>
						</div>
						<div className="right">
							<div className="imgDiv">
								<img src={"/assets/" + currentUser?.profilePic} alt="" />
								<span className="online"></span>
							</div>
							<FaEllipsisV
								onClick={() => setOpenProfile(!openProfile)}
								style={{
									fontSize: "16px",
									fontWeight: "bold",
									cursor: "pointer",
								}}
							/>
							{openProfile && (
								<div className="profile">
									<button
										onClick={() => setIsProfile(true)}
										className="viewBtn"
									>
										View Profile
									</button>
									<button onClick={handleLogout} className="logoutBtn">
										Logout
									</button>
								</div>
							)}
							{openNotification && (
								<div className="nContainer">
									<div className="nWrapper">
										<div className="list">
											<span className="listItem">
												Jonie Dev sent you a message
											</span>
											<span className="listItem">
												Jonie Dev sent you a message
											</span>
											<span className="listItem">
												Jonie Dev sent you a message
											</span>
										</div>
										<button
											className="clearBtn"
											onClick={() => setOpenNotification(false)}
										>
											Clear
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className="userSearch" onClick={() => setOpenUserSearch(true)}>
						<span className="inpuContainer">
							<BiSearch style={{ fontWeight: "bold", fontSize: "24px" }} />
							Search Users...
						</span>
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
									isChat={isChat}
									setIsChat={setIsChat}
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
			{isProfile && <Profile setIsProfile={setIsProfile} />}
		</div>
	);
};

export default Chats;
