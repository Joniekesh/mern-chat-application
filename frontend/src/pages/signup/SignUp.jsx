import "./signup.scss";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { AiOutlineEye } from "react-icons/ai";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../../components/loader/Loader";

const SignUp = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [phone, setPhone] = useState("");
	const [profilePic, setProfilePic] = useState("");
	const [loading, setLoading] = useState(false);

	const [inputs, setInputs] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const { firstName, lastName, email, password, confirmPassword } = inputs;

	const navigate = useNavigate();

	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!firstName || !lastName || !password || !phone || !email) {
			toast.error("Most inputs are required", { theme: "colored" });
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match", { theme: "colored" });
		}
		setLoading(true);
		try {
			const res = await axiosInstance.post("/auth", {
				...inputs,
				phone,
				profilePic,
			});
			if (res.status === 200) {
				toast.success(res.data, { theme: "colored" });
				navigate("/signin");
			}
			setLoading(false);
		} catch (err) {
			setLoading(false);
			toast.error(err.res.data, { theme: "colored" });
		}
	};

	return (
		<div className="signup">
			<div className="container">
				<div className="top">
					<h1>Jonie Chat App</h1>
				</div>
				<div className="bottom">
					<div className="bTop">
						<Link to="/signup" className="link">
							<span>Sign Up</span>
						</Link>
						<Link to="/signin" className="link">
							<span>Sign In</span>
						</Link>
					</div>
					<div className="bBottom">
						<form onSubmit={handleSubmit}>
							<div className="formInput">
								<label>First name</label>
								<input
									type="text"
									placeholder="Enter first name"
									name="firstName"
									value={firstName}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="formInput">
								<label>Last name</label>
								<input
									type="text"
									placeholder="Enter last name"
									name="lastName"
									value={lastName}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="formInput">
								<label>Email</label>
								<input
									type="email"
									placeholder="Enter email"
									name="email"
									value={email}
									onChange={handleChange}
									required
								/>
							</div>
							<div className="passwordInput">
								<label>Password</label>
								<div className="inputContainer">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="Enter password"
										name="password"
										value={password}
										onChange={handleChange}
										required
									/>
									<AiOutlineEye
										style={{
											fontWeight: "bold",
											cursor: "pointer",
											fontSize: "18px",
										}}
										onClick={() => setShowPassword(!showPassword)}
									/>
								</div>
							</div>
							<div className="formInput">
								<label>Confirm password</label>
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Confirm password"
									name="confirmPassword"
									value={confirmPassword}
									onChange={handleChange}
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
									required
								/>
							</div>
							<input
								type="file"
								value={profilePic}
								onChange={(e) => setProfilePic(e.target.files[0])}
							/>
							<button className="login">
								{loading ? <Loader /> : "SIGN UP"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
