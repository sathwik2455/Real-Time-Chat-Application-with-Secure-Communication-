import path from "path";
import dotenv from "dotenv";

const __dirname = path.resolve();

dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const ALLOWED_NODE_ENVS = new Set(["development", "production", "test"]);

const getTrimmed = (value) => (value ? String(value).trim() : "");

const validateAndBuildEnv = () => {
	const missing = [];

	const mongoUri = getTrimmed(process.env.MONGO_URI || process.env.MONGO_DB_URI);
	const jwtSecret = getTrimmed(process.env.JWT_SECRET);

	if (!mongoUri) missing.push("MONGO_URI (or MONGO_DB_URI)");
	if (!jwtSecret) missing.push("JWT_SECRET");

	const rawPort = getTrimmed(process.env.PORT || "5000");
	const port = Number(rawPort);
	if (!Number.isInteger(port) || port <= 0 || port > 65535) {
		throw new Error(`Invalid PORT value "${rawPort}". Use a number between 1 and 65535.`);
	}

	const nodeEnv = getTrimmed(process.env.NODE_ENV || "development");
	if (!ALLOWED_NODE_ENVS.has(nodeEnv)) {
		throw new Error(
			`Invalid NODE_ENV value "${nodeEnv}". Allowed: development, production, test.`
		);
	}

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}. ` +
				`Add them in backend/.env before starting the server.`
		);
	}

	return Object.freeze({
		nodeEnv,
		port,
		mongoUri,
		jwtSecret,
	});
};

export const env = validateAndBuildEnv();
