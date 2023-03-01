import { useDispatch, useSelector } from "react-redux";
import "./rightBar.scss";

import { BsFillBellFill } from "react-icons/bs";
import { FaEllipsisV } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/AuthRedux";
import { clearUser } from "../../redux/UserRedux";
import Profile from "../profile/Profile";
import { isOnline } from "../../utils/onlineUser";

const RightBar = ({ chat, onlineUsers }) => {
	const [openNotification, setOpenNotification] = useState(false);
	const [openProfile, setOpenProfile] = useState(false);
	const [isProfile, setIsProfile] = useState(false);

	const { userInfo } = useSelector((state) => state.user);
	const currentUser = userInfo?.user;

	const friend =
		!chat?.isGroupChat &&
		chat?.members.find((member) => member._id !== currentUser._id);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		dispatch(clearUser());
	};

	const online = isOnline(onlineUsers, currentUser?._id);

	return (
		<div className="rightBar">
			<div className="container">
				<div className="top">
					<div
						className="notification"
						onClick={() => setOpenNotification(!openNotification)}
					>
						<BsFillBellFill style={{ fontSize: "16px" }} />
						<span>9</span>
					</div>
					<div className="rbImgDiv">
						<img src={currentUser?.profilePic} alt="" />
						{online && <span className="online"></span>}
					</div>
					<FaEllipsisV
						onClick={() => setOpenProfile(!openProfile)}
						style={{ fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
					/>
					{openNotification && (
						<div className="nContainer">
							<div className="nWrapper">
								<div className="list">
									<span className="listItem">Jonie Dev sent you a message</span>
									<span className="listItem">Jonie Dev sent you a message</span>
									<span className="listItem">Jonie Dev sent you a message</span>
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
					{openProfile && (
						<div className="profile">
							<button className="viewBtn" onClick={() => setIsProfile(true)}>
								View Profile
							</button>
							<button className="logoutBtn" onClick={handleLogout}>
								Logout
							</button>
						</div>
					)}
				</div>
				<div className="bottom">
					<h2>
						{chat?.isGroupChat
							? chat?.chatName
							: friend?.firstName + " " + friend?.lastName}
					</h2>
					<img
						src={chat?.isGroupChat ? chat?.chatImg : friend?.profilePic}
						alt=""
					/>
					<p>Fullstack developer @ own company</p>
					<div className="contact">
						<span>Contact:</span>
						<span>{friend?.email}</span>
						<span>{friend?.phone}</span>
					</div>
				</div>
			</div>
			{isProfile && <Profile setIsProfile={setIsProfile} />}
		</div>
	);
};

export default RightBar;
