
import { DataSource } from "typeorm";
import CardFlagModel from "../../../../card/model/CardFlagModel";

export default class CardFlagSeeder {
	static async execute(dataSource: DataSource): Promise<void> {
		const cardFlagDAO = dataSource.getRepository(CardFlagModel);

		const existingCardFlags = await cardFlagDAO.find();
		if (existingCardFlags.length > 0) {
			return;
		}

		const cardFlags = [
			{ description: "Visa" },
			{ description: "Elo" },
			{ description: "Mastercard" },
		];

		await cardFlagDAO.save(cardFlags);
	}
}
