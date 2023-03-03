import { useState } from "react";
import "./resetPassword.scss";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";

const ResetPassword = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const { resetToken } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password.length < 6 || confirmPassword.length < 6) {
			return toast.error(
				"Password of not less than 6 characters is required!",
				{
					theme: "colored",
				}
			);
		}

		if (password !== confirmPassword) {
			return toast.error("Passwords do not match!", {
				theme: "colored",
			});
		}

		try {
			const res = await axiosInstance.put(`/auth/${resetToken}`, {
				password,
				resetToken,
			});
			if (res.status === 200) {
				toast.success(res.data.data, { theme: "colored" });
				navigate("/signin");
			}
		} catch (err) {
			toast.error(err.response.data, { theme: "colored" });
		}
	};

	return (
		<div className="resetPassword">
			<div className="container">
				<form onSubmit={handleSubmit}>
					<h2>Reset Password</h2>
					<div className="formInput">
						<label>Password:</label>
						<input
							type="text"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div className="formInput">
						<label>Confirm Password:</label>
						<input
							type="text"
							placeholder="Confirm password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>
					<button type="submit">RESET</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
