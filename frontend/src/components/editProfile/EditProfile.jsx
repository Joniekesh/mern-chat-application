import "./editProfile.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { loadUser } from "../../redux/UserApi";
import Loader from "../loader/Loader";

const EditProfile = () => {
	const { currentUser } = useSelector((state) => state.auth);
	const token = currentUser?.token;

	const { userInfo } = useSelector((state) => state.user);
	const user = userInfo?.user;

	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState("");
	const [phone, setPhone] = useState(user?.phone);
	const [firstName, setfirstName] = useState(user?.firstName);
	const [lastName, setLastName] = useState(user?.lastName);
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

	return (
		<div className="editProfile">
			<div className="editContainer">
				<div className="top">
					<button className="backBtn" onClick={() => navigate(-1)}>
						GO BACK
					</button>
					<h2>Edit Profile</h2>
				</div>
				<form onSubmit={handleUpdate}>
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
					<input
						type="file"
						// value={file}
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<button type="submit" className="login">
						{loading ? <Loader /> : "UPDATE"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditProfile;
