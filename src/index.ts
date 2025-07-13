import express, { Express } from "express";
import defaultMiddlewareConfig from "./middlewares/defaultMiddleware.config";
import configRoutes from "./middlewares/configRoutes";
import environment from "./config/environment";

const server: Express = express();
defaultMiddlewareConfig(server);
configRoutes(server);

server.listen(environment.server.port, () => {
	console.log(`[INFO] 🟢 Server is running on port ${environment.server.port}`);
});

export default server;
