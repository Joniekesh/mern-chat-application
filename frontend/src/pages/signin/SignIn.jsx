import "./signin.scss";
import { AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../redux/AuthApi";
import { toast } from "react-toastify";
import Loader from "../../components/loader/Loader";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { loading } = useSelector((state) => state.auth);

	const handleSubmit = (e) => {
		e.preventDefault();

		dispatch(signIn({ email, password }));
		// navigate("/");
	};

	return (
		<div className="signin">
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
								<label>Email</label>
								<input
									type="email"
									placeholder="Enter email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="passwordInput">
								<label>Password</label>
								<div className="inputContainer">
									<input
										type={showPassword ? "text" : "password"}
										placeholder="Enter password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
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
							<button type="submit" className="login">
								{loading ? <Loader /> : "SIGN IN"}
							</button>
						</form>
						<Link to="/forgotpassword">
							<button className="forgotPassword">FORGOT PASSWORD?</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
