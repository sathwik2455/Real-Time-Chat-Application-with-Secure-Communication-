import path from "path";
import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { env } from "./config/env.js";
import { app, server } from "./socket/socket.js";

const __dirname = path.resolve();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const startServer = (port) => {
	server.once("error", (error) => {
		if (error.code === "EADDRINUSE") {
			console.log(`Backend is already running on port ${port}.`);
			process.exit(0);
			return;
		}

		console.log("Server failed to start", error.message);
		process.exit(1);
	});

	server.listen(port, () => {
		connectToMongoDB();
		console.log(`Server Running on port ${port}`);
	});
};

startServer(env.port);
