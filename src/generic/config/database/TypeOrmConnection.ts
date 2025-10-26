import { DataSource } from "typeorm";
import DatabaseConnectionError from "./errors/DatabaseConnectionError";
import CardFlagSeeder from "./seeders/CardFlagSeeder";
import BookSeeder from "./seeders/books/BookSeeder";
import UserSeeder from "./seeders/user/UserSeeder";
import CouponsSeeder from "./seeders/coupons/CouponsSeeder";

export default class TypeOrmConnection {
	static async connect(dataSource: DataSource) {
		if (!dataSource.isInitialized) {
			console.log("[INFO] 🔌 Establishing database connection");

			await dataSource.initialize().catch((error) => {
				throw new DatabaseConnectionError(error);
			});

			console.log("[INFO] 🟢 Database initialized successfully");

			await CardFlagSeeder.execute(dataSource);
			console.log("[INFO] 💳 Card flags seeded successfully");
			await BookSeeder.execute(dataSource);
			console.log("[INFO] 📚 Books seeded successfully");
			await UserSeeder.execute(dataSource);
			console.log("[INFO] 👤 Users seeded successfully");
			await CouponsSeeder.execute(dataSource);
			console.log("[INFO] 🎟️  Coupons seeded successfully");
		}
	}
}
