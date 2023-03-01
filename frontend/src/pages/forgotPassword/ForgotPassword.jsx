import "./forgotPassword.scss";

const ForgotPassword = () => {
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
					<form>
						<div className="formInput">
							<label>Email:</label>
							<input type="email" placeholder="Enter email" />
						</div>
						<button type="submit">SEND</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
