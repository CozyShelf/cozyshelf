import { DataSource } from "typeorm";
import DatabaseConnectionError from "../../errors/DatabaseConnectionError";

export default class TypeOrmConnection {
	static async connect(dataSource: DataSource) {
		if (!dataSource.isInitialized) {
			console.log("[INFO] 🔌 Establishing database connection");

			await dataSource
				.initialize()
				.then(() => {
					console.log("[INFO] 🟢 Database initialized successfully");
				})
				.catch((error) => {
					throw new DatabaseConnectionError(error);
				});
		}
	}
}
