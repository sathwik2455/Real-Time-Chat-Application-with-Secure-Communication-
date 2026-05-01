import {
	buildAuthUserResponse,
	createUserAccount,
	findUserByCredentials,
} from "../services/auth.service.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
	try {
		const { fullName, username, password, confirmPassword, gender } = req.body;

		const signupResult = await createUserAccount({
			fullName,
			username,
			password,
			confirmPassword,
			gender,
		});

		if (!signupResult.success) {
			return res.status(400).json({ error: signupResult.error });
		}

		generateTokenAndSetCookie(signupResult.user._id, res);
		res.status(201).json(buildAuthUserResponse(signupResult.user));
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await findUserByCredentials({ username, password });

		if (!user) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);
		res.status(200).json(buildAuthUserResponse(user));
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
