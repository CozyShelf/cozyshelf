import dotenv from "dotenv";

dotenv.config();

const environment = {
	server: {
		port: process.env.PORT || 3000
	}
};

export default environment;
