import "./profile.scss";
import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { axiosInstance } from "../../utils/axiosInstance";
import Loader from "../../components/loader/Loader";
import { loadUser } from "../../redux/UserApi";
import { toast } from "react-toastify";
import { BsFillCameraFill } from "react-icons/bs";

const Profile = ({ setIsProfile }) => {
	const { currentUser } = useSelector((state) => state.auth);
	const token = currentUser?.token;

	const { userInfo } = useSelector((state) => state.user);
	const user = userInfo?.user;

	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState("");
	const [phone, setPhone] = useState(user?.phone);
	const [firstName, setfirstName] = useState(user?.firstName);
	const [lastName, setLastName] = useState(user?.lastName);
	const [bio, setBio] = useState(user?.bio);
	const [email, setEmail] = useState(user?.email);

	const [password, setPassword] = useState(user?.password);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleUpdate = async (e) => {
		e.preventDefault();

		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		if (password && password.length < 6) {
			return toast.error("Password should not be less than 6 characters!", {
				theme: "colored",
			});
		}

		const data = new FormData();
		data.append("file", file);

		const uploadRes = await axiosInstance.post("/upload", data);
		const url = uploadRes.data;

		const updatedUser = {
			firstName,
			lastName,
			email,
			password,
			bio,
			phone,
			profilePic: file ? url : user.profilePic,
		};
		setLoading(true);
		try {
			const res = await axiosInstance.put("/users/me", updatedUser, config);
			if (res.status === 200) {
				dispatch(loadUser());
				toast.success("User successfully updated.", { theme: "colored" });
			}
			setLoading(false);
		} catch (err) {
			toast.error(err.response.data, { theme: "colored" });
			setLoading(false);
		}

		navigate("/");
	};

	const handleEdit = () => {
		setIsEdit(true);
	};
	return (
		<div className="pFile">
			{isEdit ? (
				<div className="editContainer">
					<div className="top">
						<button className="backBtn" onClick={() => setIsEdit(false)}>
							GO BACK
						</button>
						<h2>Edit Profile</h2>
					</div>
					<form onSubmit={handleUpdate}>
						<div className="imgFormInput">
							<div className="imgInputTop">
								{file && <img src={URL.createObjectURL(file)} alt="" />}
							</div>
							<div className="imgInputBottom">
								<label htmlFor="img">
									<span className="imgIcon">
										<BsFillCameraFill
											style={{ cursor: "pointer", fontSize: "24px" }}
										/>
									</span>
								</label>
								<input
									style={{ display: "none" }}
									type="file"
									id="img"
									onChange={(e) => setFile(e.target.files[0])}
								/>
							</div>
						</div>
						<div className="formInput">
							<label>First name</label>
							<input
								type="text"
								placeholder="Enter first name"
								value={firstName}
								onChange={(e) => setfirstName(e.target.value)}
							/>
						</div>
						<div className="formInput">
							<label>Last name</label>
							<input
								type="text"
								placeholder="Enter last name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
						<div className="formInput">
							<label>Email</label>
							<input
								type="email"
								placeholder="Enter email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="formInput">
							<label>Bio</label>
							<input
								type="text"
								placeholder="Write a short bio of yourself."
								value={bio}
								onChange={(e) => setBio(e.target.value)}
							/>
						</div>
						<div className="formInput">
							<label>Password</label>
							<input
								type="password"
								placeholder="Enter password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<div className="formInput">
							<PhoneInput
								initialValueFormat="national"
								defaultCountry="NG"
								placeholder="Enter phone number"
								international
								countryCallingCodeEditable={false}
								value={phone}
								onChange={setPhone}
							/>
						</div>

						<button type="submit" className="login">
							{loading ? <Loader /> : "UPDATE"}
						</button>
					</form>
				</div>
			) : (
				<div className="pContainer">
					<span className="close" onClick={() => setIsProfile(false)}>
						<MdCancel />
					</span>
					<button className="edit" onClick={handleEdit}>
						Edit Profile
					</button>
					<div className="top">
						<img
							src={"/assets/" + user?.profilePic || user?.profilePic}
							alt=""
						/>
						<span className="online"></span>
					</div>
					<h2>{user?.firstName + " " + user?.lastName}</h2>
					<span style={{ fontWeight: "600" }}>{user?.email}</span>
					<span style={{ fontWeight: "600" }}>{user?.phone}</span>
					{user?.bio && user.bio.length < 90 ? (
						<span style={{ fontWeight: "500", textAlign: "center" }}>
							{user?.bio}
						</span>
					) : (
						<span style={{ fontWeight: "500", textAlign: "center" }}>
							{user?.bio.slice(0, 90)}...
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default Profile;
