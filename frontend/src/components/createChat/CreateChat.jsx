import "./createChat.scss";
import { MdCancel } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { getChats } from "../../redux/ChatApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const CreateChat = ({ setOpen }) => {
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [chatName, setChatName] = useState("");
	const [loading, setLoading] = useState(false);

	const { users } = useSelector((state) => state.user);

	const { currentUser } = useSelector((state) => state.auth);
	const loggedinUser = currentUser?.user;
	const token = currentUser?.token;

	const guestUsers = users.filter((user) => user._id !== loggedinUser._id);

	const filteredUsers =
		guestUsers.filter((user) =>
			user.firstName.toLowerCase().includes(search)
		) ||
		guestUsers.filter((user) => user.lastName.toLowerCase().includes(search));

	const handleAdd = (user) => {
		if (selectedUsers.includes(user)) {
			return toast.error("User has already been selected.", {
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

	const newGroupChat = {
		chatName,
		isGroupChat: true,
		members: JSON.stringify(selectedUsers.map((user) => user._id)),
		groupAdmin: loggedinUser?._id,
	};

	const dispatch = useDispatch();

	const handleCreate = async (e) => {
		e.preventDefault();

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		if (!chatName || !selectedUsers) {
			return toast.error("All inputs are required", { theme: "colored" });
		}

		if (selectedUsers.length < 2) {
			return toast.error(
				"More than two users are required to create a group chat.",
				{ theme: "colored" }
			);
		}
		setLoading(true);
		try {
			const res = await axiosInstance.post("/chats", newGroupChat, config);
			if (res.status === 200) {
				dispatch(getChats());
				toast.success("Chat successfully created.", { theme: "colored" });
			}
			setLoading(false);
		} catch (err) {
			toast.error(err.response.data, { theme: "colored" });
			setLoading(false);
		}

		setOpen(false);
	};

	return (
		<div className="createChat">
			<div className="container">
				<div className="innerContainer">
					<span className="close" onClick={() => setOpen(false)}>
						<MdCancel />
					</span>
					<h2>Create Room Chat</h2>
					<div className="selectedUsers">
						{selectedUsers.map((user) => (
							<div className="selectedUsersItem" key={user._id}>
								<img src={user.profilePic} alt="" />
								<span className="username">
									{user.firstName + " " + user.lastName}
								</span>
								<span className="cancel" onClick={() => handleRemove(user._id)}>
									X
								</span>
							</div>
						))}
					</div>
					<form className="search" onSubmit={handleCreate}>
						<div className="formInput">
							<label>Chat Name:</label>
							<input
								type="text"
								placeholder="Enter group name"
								value={chatName}
								onChange={(e) => setChatName(e.target.value)}
							/>
						</div>
						<input
							className="searchInput"
							type="text"
							placeholder="Search Users to add"
							value={search}
							onChange={(e) => setSearch(e.target.value.toLowerCase())}
						/>
						<button type="submit" className="createBtn">
							{loading ? <Loader /> : "CREATE"}
						</button>
					</form>
					{search.length > 0 && (
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
				</div>
			</div>
		</div>
	);
};

export default CreateChat;
