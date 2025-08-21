import { DataSource } from "typeorm";
import environment from "../../environment";

const postgresDataSource = new DataSource({
	type: "postgres",
	host: environment.database.postgres.host,
	port: Number(environment.database.postgres.port),
	username: environment.database.postgres.username,
	password: environment.database.postgres.password,
	database: environment.database.postgres.database,
	entities: ["src/**/model/*{.js,.ts}"],
	synchronize: true,
	logging: true,
});

export default postgresDataSource;
