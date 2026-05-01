import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const getProfilePictureByGender = (gender, username) => {
	const encodedUsername = encodeURIComponent(username);
	if (gender === "male") {
		return `https://avatar.iran.liara.run/public/boy?username=${encodedUsername}`;
	}

	return `https://avatar.iran.liara.run/public/girl?username=${encodedUsername}`;
};

export const buildAuthUserResponse = (user) => ({
	_id: user._id,
	fullName: user.fullName,
	username: user.username,
	profilePic: user.profilePic,
});

export const findUserByCredentials = async ({ username, password }) => {
	const user = await User.findOne({ username });
	if (!user) return null;

	const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
	return isPasswordCorrect ? user : null;
};

export const createUserAccount = async ({
	fullName,
	username,
	password,
	confirmPassword,
	gender,
}) => {
	if (password !== confirmPassword) {
		return { success: false, error: "Passwords don't match" };
	}

	const existingUser = await User.findOne({ username });
	if (existingUser) {
		return { success: false, error: "Username already exists" };
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await User.create({
		fullName,
		username,
		password: hashedPassword,
		gender,
		profilePic: getProfilePictureByGender(gender, username),
	});

	return { success: true, user: newUser };
};
