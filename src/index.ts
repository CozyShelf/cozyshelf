import "reflect-metadata";
import express, { Express } from "express";
import defaultMiddlewareConfig from "./generic/middlewares/defaultMiddlewareConfig";
import environment from "./generic/config/environment";
import TypeOrmConnection from "./generic/config/database/TypeOrmConnection";
import postgresDataSource from "./generic/config/database/datasources/postgresDataSource";

const server: Express = express();
defaultMiddlewareConfig(server);

const errorsDuringInitialization: string[] = [];

async function startServer() {
	try {
		await TypeOrmConnection.connect(postgresDataSource);
		server.listen(environment.server.port);
	} catch (error) {
		errorsDuringInitialization.push((error as Error).message)
	}
}

startServer().then(() => {
	if (errorsDuringInitialization.length > 0) {
		console.log(
			"[ERROR] 🔴 FATAL: The following errors occurred during initialization: "
		);
		errorsDuringInitialization.map((error) => console.log(`\t\t- ${error}`));
		return;
	}
	console.log(
		`[INFO] 🟢 Server is running on http://${environment.server.host}:${environment.server.port}/`
	);
});

export default server;
