import { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import "./forgotPassword.scss";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await axiosInstance.post("/auth/forgotpassword", { email });
			if (res.status === 200) {
				toast.success(res.data, { theme: "colored" });
				setEmail("");
			}
		} catch (err) {
			console.log(err);
			toast.error(err.response.data, { theme: "colored" });
		}
	};

	return (
		<div className="forgotPassword">
			<div className="container">
				<div className="top">
					<h1>Jonie Chat App</h1>
				</div>
				<div className="bottom">
					<h2>Forgot Password</h2>
					<span>
						Provide your registerd email with this site. We will send you a
						reset link.
					</span>
					<form onSubmit={handleSubmit}>
						<div className="formInput">
							<label>Email:</label>
							<input
								type="email"
								placeholder="Enter email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<button type="submit">SEND</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
