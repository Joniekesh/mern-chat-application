import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";

// @desc   Get logged in  user
// @route  GET /api/auth/me
// @access Private
export const getProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		const { password, resetPasswordToken, resetPasswordExpire, ...others } =
			user._doc;

		res.status(200).json({ user: others });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

// @desc   Create user
// @route  POST /api/auth
// @access Public
export const register = async (req, res) => {
	const { firstName, lastName, email, password, phone, profilePic, bio } =
		req.body;

	try {
		const user = await User.findOne({ email });

		if (user) {
			return res
				.status(400)
				.json(`User with email: ${user.email} already exists`);
		}

		const newUser = new User({
			firstName,
			lastName,
			email,
			password,
			phone,
			profilePic,
			bio,
		});

		await newUser.save();

		res.status(200).json("User successfully created.");
	} catch (err) {
		console.log(err);
		res.status(500).json(500);
	}
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json("Invalid email or password.");
		}

		const isMatch = await bcrypt.compareSync(req.body.password, user.password);

		if (!isMatch) {
			return res.status(400).json("Invalid email or password");
		}

		const { password, ...others } = user._doc;

		res.status(200).json({
			user: others,
			token: generateToken(user._id),
		});
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
};

// @desc   Forgot Password
// @route  POST /api/auth/forgotpassword
// @access Public
export const forgotPassword = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json("User not found!");
		}

		if (user.email !== email) {
			return res
				.status(404)
				.json(`No user with email: ${email} found in the database.`);
		}

		// Reset token generated and add hashed version to database
		const resetToken = user.getResetPasswordToken();

		await user.save();

		// Create Reset URL to email to provided email address
		const resetUrl = `http://localhost:5173/passwordreset/${resetToken}`;

		// const resetUrl = `https://joniechat.netlify.app/passwordreset/${resetToken}`;

		//HTML Message
		const message = `
   <h1>You have requested for a password reset.</h1>
   <p>Please reset your password using the following link:</p>
   <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
   `;

		try {
			await sendEmail({
				to: user.email,
				subject: "Password Reset Request.",
				text: message,
			});

			res
				.status(200)
				.json("Email sent. Please check your inbox for a reset link.");
		} catch (error) {
			res.status(500).json(error);

			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			await user.save();
		}
	} catch (error) {
		res.status(500).json(error);
	}
};

// @desc   Reset Password
// @route  PUT /api/auth/:resetToken
// @access Public
export const resetPassword = async (req, res) => {
	// Compare token in url to hashed token
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.body.resetToken)
		.digest("hex");

	try {
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpire: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json("Invalid/expired token. Please resend Reset Request.");
		}

		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save();

		res.status(200).json({
			success: true,
			data: "Password Update Success! You can now login.",
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(500).json(error);
	}
};
