import { DataSource, Repository } from "typeorm";
import IDAO from "../../../generic/dao/IDAO";
import AddressModel from "../../model/AddressModel";

export class AddressDAO implements IDAO<AddressModel> {
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
		return await this.repository.findOne({ where: { id, isActive: true } });
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
