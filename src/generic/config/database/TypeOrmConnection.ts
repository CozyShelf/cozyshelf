import { DataSource } from "typeorm";
import DatabaseConnectionError from "./errors/DatabaseConnectionError";
import CardFlagSeeder from "./seeders/CardFlagSeeder";

export default class TypeOrmConnection {
	static async connect(dataSource: DataSource) {
		if (!dataSource.isInitialized) {
			console.log("[INFO] 🔌 Establishing database connection");

			await dataSource.initialize().catch((error) => {
				throw new DatabaseConnectionError(error);
			});

			console.log("[INFO] 🟢 Database initialized successfully");
			await CardFlagSeeder.execute(dataSource);
		}
	}
}
