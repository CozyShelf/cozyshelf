import { DataSource, Repository } from "typeorm";
import CardFlagModel from "../../model/CardFlagModel";

export default class CardFlagDAO {
	private repository: Repository<CardFlagModel>;

	public constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(CardFlagModel);
	}

	public async getFlagByDescription(
		description: string
	): Promise<CardFlagModel | null> {
		return await this.repository.findOneBy({ description });
	}
}
