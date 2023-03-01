import "./profile.scss";
import { FiEdit3 } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";

const Profile = ({ setIsProfile }) => {
	const { userInfo } = useSelector((state) => state.user);

	const user = userInfo?.user;

	return (
		<div className="pFile">
			<div className="pContainer">
				<span className="close" onClick={() => setIsProfile(false)}>
					<MdCancel />
				</span>
				<span className="edit">
					<FiEdit3 />
				</span>
				<div className="top">
					<img src={user?.profilePic} alt="" />
					<span className="online"></span>
				</div>
				<h2>{user.firstName + " " + user.lastName}</h2>
				<span>{user.email}</span>
				<span>{user?.phone}</span>
				<span>Fullstack developer @ own company.</span>
			</div>
		</div>
	);
};

export default Profile;
