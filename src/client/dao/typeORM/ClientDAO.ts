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

	public async findAll(): Promise<ClientModel[] | null> {
		return await this.repository.find({ where: { isActive: true } });
	}

	public async findById(id: string): Promise<ClientModel | null> {
		return await this.repository.findOne({ where: { id, isActive: true } });
	}

	public async delete(id: string): Promise<void> {
		await this.repository.update(id, { isActive: false });
	}
}
