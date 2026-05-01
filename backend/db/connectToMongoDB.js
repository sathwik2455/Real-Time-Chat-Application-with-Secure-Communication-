import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(env.mongoUri);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
