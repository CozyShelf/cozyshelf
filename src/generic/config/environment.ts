import dotenv from "dotenv";

dotenv.config();

const environment = {
	server: {
		host: process.env.HOST || "localhost",
		port: process.env.PORT || 3000,
	},
	database: {
		postgres: {
			host: process.env.POSTGRES_HOST || "postgres",
			port: process.env.POSTGRES_PORT || 5432,
			username: process.env.POSTGRES_USERNAME || "root",
			password: process.env.POSTGRES_PASSWORD || "abc12345",
			database: process.env.POSTGRES_DB || "cozyshelf_db",
		},
	},
	ai: {
		apiKey: process.env.GEMINI_API_KEY || "",
	},
};

export default environment;
