import { DataSource, Repository } from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import CreditCardModel from "../../model/CreditCardModel";

export class CardDAO implements IDAO<CreditCardModel> {
	private dataSource: DataSource;
	private repository: Repository<CreditCardModel>;

	constructor(dataSource: DataSource) {
		this.dataSource = dataSource;
		this.repository = this.dataSource.getRepository(CreditCardModel);
	}

	public async save(client: CreditCardModel): Promise<CreditCardModel> {
		return await this.repository.save(client);
	}

	public async findAll(): Promise<CreditCardModel[] | null> {
		return await this.repository.find({
			where: { isActive: true },
			relations: ["cardFlag", "client"],
		});
	}

	public async findById(id: string): Promise<CreditCardModel | null> {
		return await this.repository
			.createQueryBuilder("card")
			.leftJoinAndSelect("card.cardFlag", "cardFlag")
			.leftJoinAndSelect("card.client", "client")
			.leftJoinAndSelect(
				"client.addresses",
				"clientAddresses",
				"clientAddresses.isActive = :addressActive",
				{ addressActive: true }
			)
			.leftJoinAndSelect(
				"client.cards",
				"clientCards",
				"clientCards.isActive = :cardActive",
				{ cardActive: true }
			)
			.leftJoinAndSelect("client.password", "password")
			.leftJoinAndSelect("client.telephone", "telephone")
			.leftJoinAndSelect("clientAddresses.country", "addressCountry")
			.leftJoinAndSelect("clientCards.cardFlag", "clientCardFlag")
			.where("card.id = :id", { id })
			.andWhere("card.isActive = :isActive", { isActive: true })
			.getOne();
	}

	public async findByClientId(clientId: string): Promise<CreditCardModel[]> {
		return await this.repository
			.createQueryBuilder("card")
			.leftJoinAndSelect("card.cardFlag", "cardFlag")
			.leftJoinAndSelect("card.client", "client")
			.where("client.id = :clientId", { clientId })
			.andWhere("card.isActive = :isActive", { isActive: true })
			.getMany();
	}

	public async findByCardNumber(
		number: string
	): Promise<CreditCardModel | null> {
		return await this.repository.findOneBy({ number });
	}

	public async delete(id: string): Promise<void> {
		await this.repository.update(id, { isActive: false });
	}
}
