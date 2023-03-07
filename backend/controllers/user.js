import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

// @desc   Update user
// @route  PUT /api/users/me
// @access Private
export const updateUser = async (req, res) => {
	const { firstName, lastName, email, phone, password, profilePic } = req.body;

	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json("User not found.");
		}

		user.firstName = firstName || user.firstName;
		user.lastName = lastName || user.lastName;
		user.email = email || user.email;
		user.phone = phone || user.phone;
		user.profilePic = profilePic || user.profilePic;

		if (password) {
			user.password = password;
		}

		const updatedUser = await user.save();

		res
			.status(200)
			.json({ updatedUser, token: generateToken(updatedUser._id) });
	} catch (error) {
		console.log(error);
		res.status(500).json("Server Error!");
	}
};

// @desc   Get all users
// @route  GET /api/users
// @access Private
export const getUsers = async (req, res) => {
	try {
		const users = await User.find();

		if (!users) return res.status(404).json("Users not found.");

		res.status(200).json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json("Server Error!");
	}
};

// @desc   Get user by ID
// @route  GET /api/users/find/:id
// @access Private
export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) return res.status(404).json("User not found.");

		const { password, ...others } = user._doc;

		res.status(200).json(others);
	} catch (error) {
		console.log(error);
		res.status(500).json("Server Error!");
	}
};
