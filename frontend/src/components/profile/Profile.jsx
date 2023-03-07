import "./profile.scss";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = ({ setIsProfile }) => {
	const { userInfo } = useSelector((state) => state.user);

	const user = userInfo?.user;

	const navigate = useNavigate();
	const handleEdit = () => {
		setIsProfile(false);
		navigate("/editprofile");
	};
	return (
		<div className="pFile">
			<div className="pContainer">
				<span className="close" onClick={() => setIsProfile(false)}>
					<MdCancel />
				</span>
				<button className="edit" onClick={handleEdit}>
					Edit Profile
				</button>
				<div className="top">
					<img src={"/assets/" + user?.profilePic || user?.profilePic} alt="" />
					<span className="online"></span>
				</div>
				<h2>{user?.firstName + " " + user?.lastName}</h2>
				<span>{user?.email}</span>
				<span>{user?.phone}</span>
				<span>Fullstack developer @ own company.</span>
			</div>
		</div>
	);
};

export default Profile;
