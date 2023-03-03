import "./chatRoomModal.scss";
import { useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { useState } from "react";
import { isOnline } from "../../utils/onlineUser";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChatRoomModal = ({ setOpenRoom, chat, onlineUsers }) => {
	const [text, setText] = useState("");

	const { currentUser: me } = useSelector((state) => state.auth);

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const friend =
		!chat?.isGroupChat &&
		chat?.members.find((member) => member._id !== currentUser._id);

	const copyToClipBoard = (e) => {
		e.preventDefault();
		navigator.clipboard.writeText(window.location.href);

		setText("Link Copied");
	};

	const config = {
		headers: {
			Authorization: `Bearer ${me?.token}`,
		},
	};

	const navigate = useNavigate();

	const deleteRoom = async () => {
		try {
			const res = await axiosInstance.delete(`/chats/${chat._id}`, config);
			if (res.status === 200) {
				toast.success(res.data, { theme: "colored" });
				navigate("/");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const online = isOnline(onlineUsers, friend?._id);

	return (
		<div className="chatRoomModal">
			<div className="mContainer">
				<div className="topContainer">
					<span className="close" onClick={() => setOpenRoom(false)}>
						<MdCancel />
					</span>
					<span className="edit">
						<FiEdit3 />
					</span>
					<div className="top">
						<img
							src={chat?.isGroupChat ? chat.chatImg : friend?.profilePic}
							alt=""
						/>
						<span className="name">
							{chat?.isGroupChat
								? chat?.chatName
								: friend?.firstName + " " + friend?.lastName}
						</span>
						{chat?.isGroupChat && (
							<span className="participants">
								{chat?.members.length} participants
							</span>
						)}

						{!chat?.isGroupChat && (
							<span className="phone">{friend?.phone && friend?.phone}</span>
						)}
						{!chat?.isGroupChat && (
							<span className="email">{friend?.email}</span>
						)}
						{chat?.isGroupChat && (
							<div className="roomLink">
								<span>{window.location.href.slice(0, 32)}...</span>
								<button onClick={copyToClipBoard}>Copy Room Link</button>
								{text && <div className="linkText">{text}</div>}
							</div>
						)}
						{chat?.isGroupChat && chat.groupAdmin._id === currentUser._id && (
							<button onClick={deleteRoom} className="delRoom">
								DELETE ROOM
							</button>
						)}
					</div>
					<hr />
				</div>
				{chat?.isGroupChat && (
					<div className="bottom">
						{chat.members.map((member) => (
							<div className="item" key={member._id}>
								<div className="itemLeft">
									<div className="bLeft">
										<img src={member?.profilePic} alt="" />
										{online && <span className="online"></span>}
									</div>
									<div className="bRight">
										<span className="uName">
											{member.firstName + " " + member.lastName}
										</span>
										<span className="text">Hello...</span>
									</div>
								</div>
								<div className="itemRight">
									{member._id === chat.groupAdmin._id && (
										<span className="admin">Admin</span>
									)}
									{currentUser._id === chat.groupAdmin._id && (
										<button className="removeUser">Remove User</button>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatRoomModal;
