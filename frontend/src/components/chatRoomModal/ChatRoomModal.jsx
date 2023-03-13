import "./chatRoomModal.scss";
import { useDispatch, useSelector } from "react-redux";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";
import { isOnline } from "../../utils/onlineUser";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { removeRoomUser } from "../../redux/ChatApi";
import { setIsChat } from "../../redux/ChatRedux";
import axios from "axios";

const ChatRoomModal = ({ setOpenRoom, chat, onlineUsers }) => {
	const [text, setText] = useState("");
	const [file, setFile] = useState("");
	const [chatName, setChatName] = useState(chat?.chatName);
	const [search, setSearch] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);

	const [isEdit, setIsEdit] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { currentUser: me } = useSelector((state) => state.auth);

	const { userInfo, users } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const friend =
		!chat?.isGroupChat &&
		chat?.members.find((member) => member._id !== currentUser._id);

	const guestUsers = users.filter((user) => user._id !== currentUser._id);

	const filteredUsers =
		guestUsers.filter((user) =>
			user.firstName.toLowerCase().includes(search)
		) ||
		guestUsers.filter((user) => user.lastName.toLowerCase().includes(search));

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

	const deleteRoom = async () => {
		if (window.confirm("Are you SURE? This can`t be UNDONE!")) {
			try {
				const res = await axiosInstance.delete(`/chats/${chat._id}`, config);
				if (res.status === 200) {
					toast.success(res.data, { theme: "colored" });
					navigate("/");
					dispatch(setIsChat(false));
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleAdd = (user) => {
		if (selectedUsers.includes(user)) {
			return toast.error("User has already been selected.", {
				theme: "colored",
			});
		} else if (chat?.members.some((member) => member._id === user._id)) {
			return toast.error("User is already a room member.", {
				theme: "colored",
			});
		} else {
			setSelectedUsers([...selectedUsers, user]);
			toast.success(`${user.firstName + " " + user.lastName} selected`, {
				theme: "colored",
			});
		}
	};

	const handleRemove = (id) => {
		setSelectedUsers(selectedUsers.filter((user) => user._id !== id));
	};

	const removeUser = (id) => {
		dispatch(removeRoomUser(chat._id, id));
	};

	const handleCancel = () => {
		setIsEdit(false);
		setSearch("");
		setSelectedUsers([]);
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append("file", file);
		data.append("upload_preset", "upload");

		const uploadRes = await axios.post(
			"https://api.cloudinary.com/v1_1/joniekesh/image/upload",
			data
		);

		const { url } = uploadRes.data;

		const editGroupChat = {
			chatName,
			chatImg: file ? url : chat.chatImg,
			isGroupChat: true,
			members:
				JSON.stringify(selectedUsers.map((user) => user._id)) || chat.members,
			groupAdmin: currentUser?._id,
		};

		try {
			const res = await axiosInstance.put(
				`/chats/${chat._id}/update`,
				editGroupChat,
				config
			);
			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const createConversation = async (receiverId) => {
		try {
			const res = await axiosInstance.post(
				`/chats/${currentUser._id}/${receiverId}`,
				{
					members: { senderId: currentUser._id, receiverId },
				},
				config
			);

			if (res.status === 200) {
				navigate(`/chats/${res.data._id}`);
			}
		} catch (err) {
			console.log(err.response.data);
		}
	};

	const online = isOnline(onlineUsers, friend?._id);

	return (
		<div className="chatRoomModal">
			<div className="mContainer">
				<div className="topContainer">
					{chat?.isGroupChat && isEdit ? (
						<button className="cancel" onClick={handleCancel}>
							Cancel Update
						</button>
					) : (
						<span className="close" onClick={() => setOpenRoom(false)}>
							<MdCancel />
						</span>
					)}
					{chat?.isGroupChat &&
						!isEdit &&
						chat?.roomAdmin?._id === currentUser?._id && (
							<button onClick={() => setIsEdit(true)} className="edit">
								Edit Room/Add Users
							</button>
						)}
					{chat?.isGroupChat && isEdit && (
						<div className="selectedUsers">
							{selectedUsers.map((user) => (
								<div className="selectedUsersItem" key={user._id}>
									<img src={user.profilePic} alt="" />
									<span className="username">
										{user.firstName + " " + user.lastName}
									</span>
									<span
										className="Xmark"
										onClick={() => handleRemove(user._id)}
									>
										X
									</span>
								</div>
							))}
						</div>
					)}
					<form className="top" onSubmit={handleUpdate}>
						{chat?.isGroupChat && isEdit ? (
							<div className="formInput">
								<label>Room Image:</label>
								<input
									type="file"
									onChange={(e) => setFile(e.target.files[0])}
								/>
							</div>
						) : (
							<img
								src={chat?.isGroupChat ? chat.chatImg : friend?.profilePic}
								alt=""
							/>
						)}
						{isEdit ? (
							<div className="formInput">
								<label>Chat Name:</label>
								<input
									type="text"
									value={chatName}
									onChange={(e) => setChatName(e.target.value)}
								/>
							</div>
						) : (
							<span className="name">
								{chat?.isGroupChat
									? chat?.chatName
									: friend?.firstName + " " + friend?.lastName}
							</span>
						)}
						{isEdit && chat?.isGroupChat && (
							<div className="formInput">
								<label>Add Users:</label>
								<input
									type="text"
									placeholder="Search users to add"
									value={search}
									onChange={(e) => setSearch(e.target.value.toLowerCase())}
								/>
							</div>
						)}
						{!isEdit && chat?.isGroupChat && (
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
						{chat?.isGroupChat && !isEdit && (
							<div className="roomLink">
								<span>{window.location.href.slice(0, 32)}...</span>
								<button onClick={copyToClipBoard}>Copy Room Link</button>
								{text && <div className="linkText">{text}</div>}
							</div>
						)}
						{!isEdit &&
						chat?.isGroupChat &&
						chat.groupAdmin?._id === currentUser?._id ? (
							<button onClick={deleteRoom} className="delRoom">
								DELETE ROOM
							</button>
						) : (
							chat?.isGroupChat &&
							chat.groupAdmin?._id === currentUser?._id && (
								<button
									type="submit"
									style={{ backgroundColor: "green", color: "white" }}
									onClick={deleteRoom}
									className="delRoom"
								>
									UPDATE ROOM
								</button>
							)
						)}
					</form>

					{chat?.isGroupChat && isEdit && search.length > 0 && (
						<div className="users">
							{filteredUsers.map((user) => (
								<div
									key={user._id}
									className="userList"
									onClick={() => handleAdd(user)}
								>
									<img src={user.profilePic} alt="" />
									<span className="userName">
										{user.firstName + " " + user.lastName}
									</span>
									<span className="online"></span>
								</div>
							))}
						</div>
					)}
					<hr />
				</div>

				{!isEdit && chat?.isGroupChat && (
					<div className="bottom">
						{chat.members.map((member) => (
							<button
								className="item"
								key={member?._id}
								disabled={member?._id === chat.groupAdmin?._id}
							>
								<div
									className="itemLeft"
									onClick={() => createConversation(member?._id)}
									disabled={member?._id === chat.groupAdmin?._id}
								>
									<div className="bLeft">
										<img src={member?.profilePic} alt="" />
										{online && <span className="online"></span>}
									</div>
									<div className="bRight">
										<span className="uName">
											{member.firstName + " " + member.lastName}
										</span>
									</div>
								</div>
								<div className="itemRight">
									{member?._id === chat.groupAdmin?._id && (
										<span className="admin">Admin</span>
									)}
									{currentUser?._id === chat.groupAdmin?._id && (
										<span
											className="remvBtn"
											style={{
												backgroundColor: "crimson",
												color: "white",
												padding: "4px",
												border: "none",
												fontSize: "12px",
											}}
											disabled={member?._id === chat.groupAdmin?._id}
											onClick={() => removeUser(member?._id)}
										>
											Remove User
										</span>
									)}
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ChatRoomModal;
