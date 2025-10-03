import { DataSource, Repository } from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import AddressModel from "../../model/AddressModel";

export class 	AddressDAO implements IDAO<AddressModel> {
	private repository: Repository<AddressModel>;

	constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(AddressModel);
	}

	public async save(client: AddressModel): Promise<AddressModel> {
		return await this.repository.save(client);
	}

	public async findAll(): Promise<AddressModel[] | null> {
		return await this.repository.find({ where: { isActive: true } });
	}

	public async findById(id: string): Promise<AddressModel | null> {
		return await this.repository
			.createQueryBuilder("address")
			.leftJoinAndSelect("address.client", "client")
			.leftJoinAndSelect("address.country", "country")
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
			.leftJoinAndSelect("clientCards.cardFlag", "cardFlag")
			.where("address.id = :id", { id })
			.andWhere("address.isActive = :isActive", { isActive: true })
			.getOne();
	}

	public async findByClientId(clientId: string): Promise<AddressModel[]> {
		return await this.repository.find({
			where: {
				client: { id: clientId },
				isActive: true,
			},
			relations: ["client", "country"],
		});
	}

	public async delete(id: string): Promise<void> {
		await this.repository.update(id, { isActive: false });
	}
}
