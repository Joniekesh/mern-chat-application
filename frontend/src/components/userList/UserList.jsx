import "./userList.scss";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";
import { useState } from "react";

const UserList = ({ setOpenUserSearch }) => {
	const [search, setSearch] = useState("");

	const { userInfo, users } = useSelector((state) => state.user);
	const me = userInfo?.user;

	const guestUsers = users.filter((user) => user._id !== me._id);

	const filteredUsers =
		guestUsers.filter((user) =>
			user.firstName.toLowerCase().includes(search)
		) ||
		guestUsers.filter((user) => user.lastName.toLowerCase().includes(search));

	return (
		<div className="uList">
			<div className="container">
				<span className="close" onClick={() => setOpenUserSearch(false)}>
					<MdCancel />
				</span>
				<div className="innerContainer">
					<input
						type="text"
						placeholder="Search User"
						value={search}
						onChange={(e) => setSearch(e.target.value.toLowerCase())}
					/>
					{search.length > 0 && (
						<ul>
							{filteredUsers.map((user) => (
								<div key={user._id}>
									<li>
										<div className="imgDiv">
											<img src={user.profilePic} alt="" />
											<span className="online"></span>
										</div>
										<span className="uName">
											{user.firstName + " " + user.lastName}
										</span>
									</li>
									<hr />
								</div>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserList;
