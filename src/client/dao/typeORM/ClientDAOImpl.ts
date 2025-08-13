import {DataSource, Repository} from "typeorm";
import ClientModel from "../../model/ClientModel";

export class ClientDAOImpl {
	private dataSource: DataSource;
	private repository: Repository<ClientModel>;

	constructor(dataSource: DataSource) {
		this.dataSource = dataSource;
		this.repository = this.dataSource.getRepository(ClientModel);
	}

	public async save(client: ClientModel): Promise<ClientModel> {
		return await this.repository.save(client);
	}

	public async getAll(): Promise<ClientModel[] | null> {
		return await this.repository.find();
	}

	public async getById(id: string): Promise<ClientModel | null> {
		return await this.repository.findOne({ where: { id } });
	}

	public async delete(id: string): Promise<void> {
		await this.repository.delete(id);
	}
}
