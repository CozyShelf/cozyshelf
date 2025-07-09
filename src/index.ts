import dotenv from "dotenv";
import express from "express";
import defaultMiddlewareConfig from "./middlewares/defaultMiddleware.config";
import routesConfig from "./routes/routesConfig";

dotenv.config();

const port = process.env.PORT || 3000;

const server = express();
defaultMiddlewareConfig(server);
routesConfig(server);

server.listen(port, () => {
	console.log(`[INFO] 🟢 Server is running on port ${port}`);
});
