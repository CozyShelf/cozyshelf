import { DataSource, Repository } from "typeorm";
import ClientModel from "../../model/ClientModel";
import IDAO from "../../../generic/dao/IDAO";

export default class ClientDAO implements IDAO<ClientModel> {
	private repository: Repository<ClientModel>;

	constructor(dataSource: DataSource) {
		this.repository = dataSource.getRepository(ClientModel);
	}

	public async save(client: ClientModel): Promise<ClientModel> {
		return await this.repository.save(client);
	}

	public async findByCPF(cpf: string) {
		return await this.repository.findOneBy({ cpf });
	}

	public async findByEmail(email: string) {
		return await this.repository.findOneBy({ email });
	}

	public async findAll(): Promise<ClientModel[] | null> {
		return await this.repository.find({ where: { isActive: true } });
	}

	public async findById(id: string): Promise<ClientModel | null> {
		return await this.repository
			.createQueryBuilder("client")
			.leftJoinAndSelect(
				"client.addresses",
				"address",
				"address.isActive = :addressActive",
				{ addressActive: true }
			)
			.leftJoinAndSelect(
				"client.cards",
				"card",
				"card.isActive = :cardActive",
				{ cardActive: true }
			)
			.leftJoinAndSelect("client.password", "password")
			.leftJoinAndSelect("client.telephone", "telephone")
			.leftJoinAndSelect("address.country", "country")
			.leftJoinAndSelect("card.cardFlag", "cardFlag")
			.where("client.id = :id", { id })
			.andWhere("client.isActive = :clientActive", { clientActive: true })
			.getOne();
	}

	public async delete(id: string): Promise<void> {
		await this.repository.update(id, { isActive: false });
	}
}
